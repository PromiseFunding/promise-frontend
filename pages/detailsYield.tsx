import type { NextPage } from "next"
import { abi, contractAddresses, yieldAbi } from "../constants"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ref, onValue } from "firebase/database"
import { database } from "../firebase-config"
import { databaseFundObject, fundSummary, funderSummaryYield } from "../config/types"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"
import styles from "../styles/details/details.module.css"
import Image from "next/image"
import Button from "@mui/material/Button"
import Head from "next/head"
import Header from "../components/Header"
import StateStatusYield from "../components/discover/StateStatusYield"
import TabsContentYield from "../components/details/TabsContentYield"
import DonateYield from "../components/details/DonateYield"
import WithdrawYield from "../components/details/WithdrawYield"
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
import { ethers } from "ethers"
import { DEFAULT_CHAIN_ID } from "../config/helper-config"
import { ConnectButton } from "web3uikit"

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    height: "30%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
    borderRadius: "25px",
}

const Details: NextPage = () => {
    const router = useRouter()
    const fundAddress = router.query.fund as string
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = chainIdHex ? parseInt(chainIdHex!).toString() : DEFAULT_CHAIN_ID

    const rpcUrl =
        chainId == "421613"
            ? process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_RPC_URL
            : "http://localhost:8545"
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const signer = provider

    const fundRef = ref(database, chainId + "/funds/" + fundAddress)
    const [data, setData] = useState<databaseFundObject>()
    const [assetAddress, setAssetAddress] = useState("")
    const [owner, setOwner] = useState("")
    const [totalActiveFunded, settotalActiveFunded] = useState(0)
    const [totalActiveInterestFunded, settotalActiveInterestFunded] = useState(0)
    const [totalLifetimeFunded, settotalLifetimeFunded] = useState(0)
    const [totalLifetimeStraightFunded, settotalLifetimeStraightFunded] = useState(0)
    const [totalLifetimeInterestFunded, settotalLifetimeInterestFunded] = useState(0)
    const [amountWithdrawnByOwner, setamountWithdrawnByOwner] = useState(0)
    const [lockTime, setLockTime] = useState(0)
    const [fundSummary, setFundSummary] = useState<fundSummary>()
    const [funderSummary, setFunderSummary] = useState<funderSummaryYield>()
    const [open, setOpen] = useState(false)

    const [funderParam, setFunderParam] = useState("")
    const [userAddress, setUserAddress] = useState("")

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

    const getFundSummary = async () => {
        const contract = new ethers.Contract(fundAddress, yieldAbi as any[], signer)

        const getResult = async () => {
            const result = await contract.getFundSummary()
            return result
        }

        return getResult()
    }

    const getFunderSummary = async () => {
        const contract = new ethers.Contract(fundAddress, yieldAbi as any[], signer)

        const getResult = async () => {
            const result = await contract.getFunderSummary(funderParam)
            return result
        }

        return getResult()
    }

    async function updateFunderInfo() {
        if (funderParam) {
            const funderInfo = (await getFunderSummary()) as funderSummaryYield
            setFunderSummary(funderInfo)
        }
        updateUI()
    }

    async function updateUI() {
        const fundInfo = (await getFundSummary()) as fundSummary
        setFundSummary(fundInfo)
        const ownerFromCall = fundInfo.owner
        const assetAddressFromCall = fundInfo.assetAddress
        setAssetAddress(assetAddressFromCall!)
        setOwner((ownerFromCall as String).toLowerCase())
        const totalActiveFunded = fundInfo.totalActiveFunded
        const totalActiveInterestFunded = fundInfo.totalActiveInterestFunded
        const totalLifetimeFunded = fundInfo.totalLifetimeFunded
        const totalLifetimeStraightFunded = fundInfo.totalLifetimeStraightFunded
        const totalLifetimeInterestFunded = fundInfo.totalLifetimeInterestFunded
        const totalWithdrawnByOwner = fundInfo.totalWithdrawnByOwner
        const lockTime = fundInfo.i_lockTime
        settotalActiveFunded(totalActiveFunded.toNumber() / 10 ** decimals!)
        settotalActiveInterestFunded(totalActiveInterestFunded.toNumber() / 10 ** decimals!)
        settotalLifetimeFunded(totalLifetimeFunded.toNumber() / 10 ** decimals!)
        settotalLifetimeStraightFunded(totalLifetimeStraightFunded.toNumber() / 10 ** decimals!)
        settotalLifetimeInterestFunded(totalLifetimeInterestFunded.toNumber() / 10 ** decimals!)
        setamountWithdrawnByOwner(totalWithdrawnByOwner.toNumber() / 10 ** decimals!)
        setLockTime(lockTime.toNumber())
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            setFunderParam(userAddress)
        }
    }, [isWeb3Enabled, fundAddress, userAddress])

    useEffect(() => {
        if (account) {
            setUserAddress(account)
        }
    }, [account])

    useEffect(() => {
        if (fundAddress) {
            updateFunderInfo()
        }
    }, [fundAddress, isWeb3Enabled, funderParam])

    useEffect(() => {
        onValue(fundRef, (snapshot) => {
            setData(snapshot.val())
        })
    }, [fundAddress, chainId])

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <Header main={false}></Header>
            {data && fundSummary ? (
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
                            {funderSummary ? (
                                <div className={styles.actionsInner}>
                                    <StateStatusYield
                                        fundAddress={fundAddress}
                                        fundSummary={fundSummary}
                                        funderSummaryYield={funderSummary}
                                        decimals={decimals!}
                                        format="details"
                                        coinName={coinName}
                                        yieldFundTitle={data.fundTitle}
                                    ></StateStatusYield>
                                    <div className={styles.buttons}>
                                        {userAddress != owner ? (
                                            <>
                                                <div>
                                                    <Modal
                                                        open={open}
                                                        aria-labelledby="modal-modal-title"
                                                        aria-describedby="modal-modal-description"
                                                        onClose={handleClose}
                                                    >
                                                        <Box sx={modalStyle}>
                                                            <div className={styles.shareTitle}>
                                                                Share
                                                            </div>
                                                            <div className={styles.modalFormShare}>
                                                                <br></br>
                                                                <div
                                                                    style={{ marginRight: "12px" }}
                                                                >
                                                                    <TwitterShareButton
                                                                        url={`http://localhost:3000/detailsYield?fund=${fundAddress}`}
                                                                        title={`Check out this fundraiser on @Promise called '${data.fundTitle}'.`}
                                                                        hashtags={[
                                                                            "Web3Fundraising",
                                                                        ]}
                                                                    >
                                                                        <TwitterIcon
                                                                            size={50}
                                                                            borderRadius={10}
                                                                        />
                                                                    </TwitterShareButton>
                                                                </div>
                                                                <div
                                                                    style={{ marginRight: "12px" }}
                                                                >
                                                                    <FacebookShareButton
                                                                        url={`http://localhost:3000/detailsYield?fund=${fundAddress}`}
                                                                        quote={`Check out this fundraiser on @Promise called '${data.fundTitle}'.`}
                                                                        hashtag="#Web3Fundraising"
                                                                    >
                                                                        <FacebookIcon
                                                                            size={50}
                                                                            borderRadius={10}
                                                                        />
                                                                    </FacebookShareButton>
                                                                </div>
                                                                <div
                                                                    style={{ marginRight: "12px" }}
                                                                >
                                                                    <EmailShareButton
                                                                        url={`http://localhost:3000/detailsYield?fund=${fundAddress}`}
                                                                        body={`Check out this fundraiser on the called '${data.fundTitle}'.`}
                                                                        subject={
                                                                            "Promise Web3 Fundraising"
                                                                        }
                                                                    >
                                                                        <EmailIcon
                                                                            size={50}
                                                                            borderRadius={10}
                                                                        />
                                                                    </EmailShareButton>
                                                                </div>
                                                                <div>
                                                                    <WhatsappShareButton
                                                                        url={`http://localhost:3000/detailsYield?fund=${fundAddress}`}
                                                                        title={`Check out this fundraiser on the called '${data.fundTitle}'.`}
                                                                    >
                                                                        <WhatsappIcon
                                                                            size={50}
                                                                            borderRadius={10}
                                                                        />
                                                                    </WhatsappShareButton>
                                                                </div>
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
                                                <DonateYield
                                                    fundAddress={fundAddress}
                                                    decimals={decimals!}
                                                    fundSummary={fundSummary}
                                                    funderSummaryYield={funderSummary}
                                                    onGetFunderInfo={() => {
                                                        updateFunderInfo()
                                                    }}
                                                ></DonateYield>
                                                <WithdrawYield
                                                    fundAddress={fundAddress}
                                                    decimals={decimals!}
                                                    fundSummary={fundSummary}
                                                    funderSummaryYield={funderSummary}
                                                    onGetFunderInfo={() => {
                                                        updateFunderInfo()
                                                    }}
                                                    coinName={coinName}
                                                ></WithdrawYield>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        {userAddress == owner ? (
                                            <WithdrawYield
                                                fundAddress={fundAddress}
                                                decimals={decimals!}
                                                fundSummary={fundSummary}
                                                funderSummaryYield={funderSummary}
                                                onGetFunderInfo={() => {
                                                    updateFunderInfo()
                                                }}
                                                coinName={coinName}
                                            ></WithdrawYield>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                    <div className={styles.contentLower}>
                        <TabsContentYield
                            fundAddress={fundAddress}
                            ownerFund={owner}
                            decimals={decimals!}
                            userAddress={userAddress}
                            coinName={coinName}
                            fundSummary={fundSummary}
                            funderSummaryYield={funderSummary}
                        ></TabsContentYield>
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
