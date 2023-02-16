import type { NextPage } from "next"
import { abi, contractAddresses } from "../constants"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ref, onValue } from "firebase/database"
import { database } from "../firebase-config"
import { databaseFundObject, milestoneSummary, milestone, funderSummary } from "../config/types"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"
import styles from "../styles/details/details.module.css"
import Image from "next/image"
import Button from "@mui/material/Button"
import Head from "next/head"
import Header from "../components/Header"
import StateStatus from "../components/discover/StateStatus"
import TabsContent from "../components/details/TabsContent"
import Donate from "../components/details/Donate"
import Withdraw from "../components/details/Withdraw"
import StartVote from "../components/details/StartVote"
import Vote from "../components/details/Vote"
import WithdrawExpired from "../components/details/WithdrawExpired"
import {
    TwitterShareButton,
    TwitterIcon,
    FacebookShareButton,
    FacebookIcon,
    EmailShareButton,
    EmailIcon,
    WhatsappShareButton,
    WhatsappIcon,
} from "react-share"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "375px",
    height: "50%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
    borderRadius: "25px",
}
import { ethers } from "ethers";
import { DEFAULT_CHAIN_ID } from "../config/helper-config"
import { ConnectButton } from "web3uikit"

const Details: NextPage = () => {
    const router = useRouter()
    const fundAddress = router.query.fund as string
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId: string = chainIdHex ? parseInt(chainIdHex!).toString() : DEFAULT_CHAIN_ID

    const rpcUrl = chainId == "421613" ? process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_RPC_URL : "http://localhost:8545"
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const signer = provider

    const fundRef = ref(database, chainId + "/funds/" + fundAddress)
    const [data, setData] = useState<databaseFundObject>()
    const [assetAddress, setAssetAddress] = useState("")
    const [owner, setOwner] = useState("")
    const [state, setState] = useState(0)
    const [tranche, setTranche] = useState(0)
    const [totalFunds, setTotalFunds] = useState(0)
    const [milestoneDurations, setMilestoneDurations] = useState<number[]>()
    const [milestoneSummary, setMilestoneSummary] = useState<milestoneSummary>()
    const [funderSummary, setFunderSummary] = useState<funderSummary>()

    const [funderParam, setFunderParam] = useState("")
    const [levelParam, setLevelParam] = useState(0)
    const [userAddress, setUserAddress] = useState("")
    const [open, setOpen] = useState(false)

    const addresses: contractAddressesInterface = contractAddresses

    //TODO: get helper-config working instead!... gets rid of decimal function
    const chainIdNum = parseInt(chainId)

    let coinName = "USDT"

    for (const coin in tokenConfig[chainIdNum]) {
        if (tokenConfig[chainIdNum][coin].assetAddress == assetAddress) {
            coinName = coin
        }
    }

    const decimals = chainId in addresses ? tokenConfig[chainIdNum][coinName].decimals : null

    const getMilestoneSummary = async () => {
        const contract = new ethers.Contract(fundAddress, abi as any[], signer)

        const getResult = async () => {
            const result = await contract.getMilestoneSummary()
            return result
        }

        return getResult()
    }

    const getFunderSummary = async () => {
        const contract = new ethers.Contract(fundAddress, abi as any[], signer)

        const getResult = async () => {
            const result = await contract.getFunderSummary(funderParam, levelParam)
            return result
        }

        return getResult()
    }

    function getDurations(milestones: milestone[]): number[] {
        return milestones.map((milestone) => milestone!.milestoneDuration!.toNumber())
    }

    async function updateFunderInfo() {
        if (funderParam) {
            const funderInfo = await getFunderSummary() as funderSummary
            setFunderSummary(funderInfo)
        }
        updateUI()
    }

    async function updateUI() {
        const milestoneInfo = (await getMilestoneSummary()) as milestoneSummary
        const assetAddressFromCall = milestoneInfo.assetAddress
        const ownerFromCall = milestoneInfo.owner
        const stateFromCall = milestoneInfo.state
        const trancheFromCall = milestoneInfo.currentTranche
        const totalFromCall = milestoneInfo.lifeTimeRaised
        const durationsFromCall = getDurations(milestoneInfo.milestones)

        setMilestoneSummary(milestoneInfo)
        setAssetAddress(assetAddressFromCall!)
        setOwner((ownerFromCall as String).toLowerCase())
        setState(stateFromCall)
        setTranche(trancheFromCall)
        setTotalFunds(totalFromCall.toNumber() / 10 ** decimals!)
        setMilestoneDurations(durationsFromCall!)
    }

    useEffect(() => {
        if (fundAddress) {
            setFunderParam(userAddress)
            setLevelParam(tranche)
        }
    }, [fundAddress, userAddress])

    useEffect(() => {
        if (account) {
            setUserAddress(account)
        }
    }, [account])

    useEffect(() => {
        if (fundAddress && levelParam >= 0) {
            updateFunderInfo()
        }
    }, [chainId, funderParam, levelParam, fundAddress])

    useEffect(() => {
        onValue(fundRef, (snapshot) => {
            setData(snapshot.val())
        })
    }, [fundAddress, chainId])

    const handleClose = () => {
        setOpen(false)
    }

    const donateVisible = (): boolean => {
        // when voting donating shouldn't be visible
        if (state == 1 || state == 3) {
            return false
        }
        if (account == owner) {
            // Withdraw Time, Donate gets replaced by withdraw button
            if ((state == 4 && milestoneSummary!.timeLeftRound.toNumber() == 0) || state == 2) {
                return false
            }
        } else {
            if (state == 2) {
                return false
            }
        }
        if (
            state == 0 &&
            (userAddress == owner || milestoneSummary!.timeLeftRound.toNumber() == 0)
        ) {
            return false
        }
        return true
    }

    return (
        <div>
            <Header main={false}></Header>
            {data && milestoneSummary ? (
                <div className={styles.detailsMain}>
                    <Head>
                        <title>
                            {data.fundTitle}: {data.description}
                        </title>
                        <meta
                            name="description"
                            content="Version one of the FundMe Smart Contract"
                        />
                    </Head>
                    <div className={styles.title}>{data.fundTitle}</div>
                    <div className={styles.contentMain}>
                        <div className={styles.content}>
                            <div className={styles.mainImage}>
                                <Image
                                    src={data.imageURL}
                                    alt="Fundraiser Image"
                                    layout="fill"
                                    objectFit="cover"
                                    style={{ borderRadius: "20px" }}
                                ></Image>
                            </div>
                            <div className={styles.textArea}>{data.description} </div>
                        </div>
                        <div className={styles.actionsOuter}>
                            {funderSummary ? (<div className={styles.actionsInner}>
                                <StateStatus fundAddress={fundAddress} milestoneSummary={milestoneSummary} funderSummary={funderSummary} decimals={decimals!}
                                    format="details"></StateStatus>
                                <div className={styles.buttons}>
                                    {state != 3 ? (
                                        <div>
                                            <Modal
                                                open={open}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                                onClose={handleClose}
                                            >
                                                <Box sx={modalStyle}>
                                                    <div className={styles.shareTitle}>Share</div>
                                                    <div className={styles.modalForm}>
                                                        <br></br>
                                                        <TwitterShareButton
                                                            url={`http://localhost:3000/details?fund=${fundAddress}`}
                                                            title={`Check out this milestone based fundraiser on @Promise called '${data.fundTitle}'.`}
                                                            hashtags={["Web3Fundraising"]}
                                                        >
                                                            <TwitterIcon
                                                                size={50}
                                                                borderRadius={10}
                                                            />
                                                        </TwitterShareButton>
                                                        <br></br>
                                                        <FacebookShareButton
                                                            url={`http://localhost:3000/details?fund=${fundAddress}`}
                                                            quote={`Check out this milestone based fundraiser on @Promise called '${data.fundTitle}'.`}
                                                            hashtag="#Web3Fundraising"
                                                        >
                                                            <FacebookIcon
                                                                size={50}
                                                                borderRadius={10}
                                                            />
                                                        </FacebookShareButton>
                                                        <br></br>
                                                        <EmailShareButton
                                                            url={`http://localhost:3000/details?fund=${fundAddress}`}
                                                            body={`Check out this milestone based fundraiser on the called '${data.fundTitle}'.`}
                                                            subject={"Promise Web3 Fundraising"}
                                                        >
                                                            <EmailIcon
                                                                size={50}
                                                                borderRadius={10}
                                                            />
                                                        </EmailShareButton>
                                                        <br></br>
                                                        <WhatsappShareButton
                                                            url={`http://localhost:3000/details?fund=${fundAddress}`}
                                                            title={`Check out this milestone based fundraiser on the called '${data.fundTitle}'.`}
                                                        >
                                                            <WhatsappIcon
                                                                size={50}
                                                                borderRadius={10}
                                                            />
                                                        </WhatsappShareButton>
                                                    </div>
                                                </Box>
                                            </Modal>
                                            <Button
                                                className={styles.shareButton}
                                                onClick={() => setOpen(true)}
                                            >
                                                Share
                                            </Button>
                                        </div>
                                    ) : (
                                        <></>
                                    )}

                                    {donateVisible() ? (
                                        <Donate
                                            milestoneSummary={milestoneSummary}
                                            funderSummary={funderSummary}
                                            fundAddress={fundAddress}
                                            decimals={decimals!}
                                            onGetFunderInfo={() => {
                                                updateFunderInfo()
                                            }}
                                        ></Donate>
                                    ) : (
                                        <></>
                                    )}
                                    {state == 0 &&
                                    (userAddress == owner ||
                                        milestoneSummary!.timeLeftRound.toNumber() == 0) ? (
                                        <StartVote
                                            fundAddress={fundAddress}
                                            onChangeState={() => {
                                                updateUI()
                                            }}
                                            milestoneSummary={milestoneSummary}
                                            userAddress={userAddress}
                                        ></StartVote>
                                    ) : (
                                        <></>
                                    )}
                                    {(state == 3 && userAddress != owner) ||
                                    (state == 4 &&
                                        userAddress == owner &&
                                        milestoneSummary!.timeLeftRound.toNumber() == 0) ||
                                    (state == 2 && owner.toLowerCase() == userAddress) ? (
                                        <Withdraw
                                            fundAddress={fundAddress}
                                            onChangeState={() => {
                                                updateUI()
                                            }}
                                            milestoneSummary={milestoneSummary}
                                            funderSummary={funderSummary}
                                            onGetFunderInfo={() => {
                                                updateFunderInfo()
                                            }}
                                        ></Withdraw>
                                    ) : (
                                        <></>
                                    )}
                                    {state == 2 && milestoneSummary.withdrawExpired ? (
                                        <WithdrawExpired
                                            fundAddress={fundAddress}
                                            onChangeState={() => {
                                                updateUI()
                                            }}
                                            milestoneSummary={milestoneSummary}
                                            funderSummary={funderSummary}
                                            onGetFunderInfo={() => {
                                                updateFunderInfo()
                                            }}
                                        ></WithdrawExpired>
                                    ) : (
                                        <></>
                                    )}
                                    {state == 1 ? (
                                        <Vote
                                            milestoneSummary={milestoneSummary}
                                            funderSummary={funderSummary}
                                            fundAddress={fundAddress}
                                            onGetFunderInfo={() => {
                                                updateFunderInfo()
                                            }}
                                        ></Vote>
                                    ) : (
                                        <></>
                                    )}
                                </div>

                            </div>) : (
                                <div className={styles.connectWallet}>
                                    <b style={{ color: "green" }}>
                                        {milestoneSummary.lifeTimeRaised.toNumber() / 10 ** decimals!}
                                    </b>
                                    <p style={{ fontSize: "20px" }}>{coinName} Raised Lifetime.</p>

                                    <div style={{ alignItems: "center", width: "100%", display: "flex", flexDirection: "column", marginTop: "20px" }}>

                                        <h1 style={{ fontSize: "20px", fontWeight: "700", textAlign: "center" }}>Please connect your wallet to interact with the fundraiser!</h1>
                                        <div style={{ marginTop: "15px" }}>
                                            <ConnectButton moralisAuth={true} />
                                        </div>
                                    </div>

                                </div>)}


                        </div>
                    </div>
                    <div className={styles.contentLower}>
                        <TabsContent
                            fundAddress={fundAddress}
                            tranche={tranche}
                            milestoneDurations={milestoneDurations}
                            ownerFund={owner}
                            decimals={decimals!}
                            userAddress={userAddress}
                            currState={state}
                            totalRaised={totalFunds}
                            coinName={coinName}
                            milestoneSummary={milestoneSummary}
                            funderSummary={funderSummary}
                            onChangeState={() => {
                                updateUI()
                            }}
                        ></TabsContent>
                    </div>
                </div>
            ) : (
                <div>
                    <Head>
                        <title>Promise Fundraiser</title>
                        <meta
                            name="description"
                            content="Version one of the FundMe Smart Contract"
                        />
                    </Head>
                </div>
            )}
        </div>
    )
}

export default Details
