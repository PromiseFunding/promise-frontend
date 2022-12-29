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
import Button from '@mui/material/Button';
import Head from "next/head"
import Header from "../components/Header"
import StateStatus from "../components/discover/StateStatus"
import TabsContent from "../components/details/TabsContent"
import Donate from "../components/details/Donate"
import Withdraw from "../components/details/Withdraw"
import StartVote from "../components/details/StartVote"
import Vote from "../components/details/Vote"
import WithdrawExpired from "../components/details/WithdrawExpired"

const Details2: NextPage = () => {
    const router = useRouter()
    const fundAddress = router.query.fund as string

    const fundRef = ref(database, "funds/" + fundAddress)
    const [data, setData] = useState<databaseFundObject>()
    const [assetAddress, setAssetAddress] = useState("")
    const [owner, setOwner] = useState("")
    const [amt, setAmt] = useState(0)
    const [state, setState] = useState(0)
    const [tranche, setTranche] = useState(0)
    const [timeLeft, setTimeLeft] = useState(100)
    const [totalFunds, setTotalFunds] = useState(0)
    const [milestoneDurations, setMilestoneDurations] = useState<number[]>()
    const [funderCalledVote, setFunderCalledVote] = useState<boolean>(false)
    const [numVotesTried, setNumVotesTried] = useState(0)
    const [timeLeftVoting, setTimeLeftVoting] = useState(0)
    const [milestoneSummary, setMilestoneSummary] = useState<milestoneSummary>()
    const [funderSummary, setFunderSummary] = useState<funderSummary>()

    const [funderParam, setFunderParam] = useState("")
    const [levelParam, setLevelParam] = useState(0)
    const [userAddress, setUserAddress] = useState("")

    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    //TODO: get helper-config working instead!... gets rid of decimal function
    const chainIdNum = parseInt(chainIdHex!)

    let coinName = "USDT"

    for (const coin in tokenConfig[chainIdNum]) {
        if (tokenConfig[chainIdNum][coin].assetAddress == assetAddress) {
            coinName = coin
        }
    }

    const decimals = chainId in addresses ? tokenConfig[chainIdNum][coinName].decimals : null

    const {
        runContractFunction: getMilestoneSummary,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getMilestoneSummary",
        params: {},
    })

    const {
        runContractFunction: getFunderSummary,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getFunderSummary",
        params: { funder: funderParam, level: levelParam },
    })

    function getDurations(milestones: milestone[]): number[] {
        return milestones.map(milestone => milestone!.milestoneDuration!.toNumber())
    }

    async function updateFunderInfo() {
        const funderInfo = await getFunderSummary() as funderSummary
        setFunderSummary(funderInfo)
        updateUI()
    }

    async function updateUI() {
        const milestoneInfo = await getMilestoneSummary() as milestoneSummary
        console.log('update UI')
        const assetAddressFromCall = milestoneInfo.assetAddress
        const ownerFromCall = milestoneInfo.owner
        const stateFromCall = milestoneInfo.state
        const trancheFromCall = milestoneInfo.currentTranche
        const timeLeftFromCall = milestoneInfo.timeLeftRound
        const totalFromCall = milestoneInfo.lifeTimeRaised
        const durationsFromCall = getDurations(milestoneInfo.milestones)
        const votesTriedFromCall = milestoneInfo.votesTried
        const timeLeftVotingFromCall = milestoneInfo.timeLeftVoting
        const didFunderVoteFromCall = milestoneInfo.funderCalledVote

        setMilestoneSummary(milestoneInfo)
        setAssetAddress(assetAddressFromCall!)
        setOwner((ownerFromCall as String).toLowerCase())
        setState(stateFromCall)
        setTranche(trancheFromCall)
        setTimeLeft(timeLeftFromCall.toNumber())
        setTotalFunds(totalFromCall.toNumber() / 10 ** decimals!)
        setMilestoneDurations(durationsFromCall!)
        setFunderCalledVote(didFunderVoteFromCall)
        setNumVotesTried(votesTriedFromCall.toNumber())
        setTimeLeftVoting(timeLeftVotingFromCall.toNumber())
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            setFunderParam(userAddress)
            setLevelParam(tranche)
        }
    }, [isWeb3Enabled, fundAddress, userAddress])

    useEffect(() => {
        if (account) {
            setUserAddress(account)
        }
    }, [account])

    useEffect(() => {
        if (funderParam && levelParam >= 0) {
            updateFunderInfo()
        }
    }, [funderParam, levelParam])

    useEffect(() => {
        onValue(fundRef, (snapshot) => {
            setData(snapshot.val())
        })
    }, [fundAddress])

    const donateVisible = (): boolean => {
        // when voting donating shouldn't be visible
        if (state == 1 || state == 3) {
            return false
        }
        if (account == owner) {
            // Withdraw Time, Donate gets replaced by withdraw button
            if (state == 4 && milestoneSummary!.timeLeftRound.toNumber() == 0 || state == 2) {
                return false
            }
        } else {
            if (state == 2) {
                return false
            }
        }
        if (state == 0 && (userAddress == owner || milestoneSummary!.timeLeftRound.toNumber() == 0)) {
            return false
        }
        return true
    }

    return (
        <div>
            <Header main={false}></Header>

            {data && milestoneSummary && funderSummary ? (
                <div className={styles.detailsMain}>
                    <Head>
                        <title>{data.fundTitle}: {data.description}</title>
                        <meta name="description" content="Version one of the FundMe Smart Contract" />
                    </Head>
                    <div className={styles.title}>{data.fundTitle}</div>
                    <div className={styles.contentMain}>
                        <div className={styles.content}>
                            <div className={styles.mainImage}>
                                <Image src={data.imageURL} alt="Fundraiser Image" layout='fill' objectFit='cover' style={{ borderRadius: "20px" }}>
                                </Image>
                            </div>
                            <div className={styles.textArea}>{data.description} </div>
                        </div>
                        <div className={styles.actionsOuter}>
                            <div className={styles.actionsInner}>
                                <StateStatus fundAddress={fundAddress} milestoneSummary={milestoneSummary} funderSummary={funderSummary} decimals={decimals!}
                                    format="details"></StateStatus>
                                <div className={styles.buttons}>
                                    {state != 3 ? (<Button className={styles.shareButton}>Share</Button>
                                    ) : (<></>)}

                                    {donateVisible() ? (
                                        <Donate
                                            milestoneSummary={milestoneSummary}
                                            funderSummary={funderSummary}
                                            fundAddress={fundAddress}
                                            decimals={decimals!}
                                            onGetFunderInfo={() => { updateFunderInfo() }}
                                        ></Donate>
                                    ) :
                                        (<></>)
                                    }
                                    {state == 0 && (userAddress == owner || milestoneSummary!.timeLeftRound.toNumber() == 0) ?
                                        (<StartVote
                                            fundAddress={fundAddress}
                                            onChangeState={() => {
                                                updateUI()
                                            }}
                                            milestoneSummary={milestoneSummary}
                                            userAddress={userAddress}
                                        ></StartVote>) :
                                        (<></>)}
                                    {(((state == 3 && userAddress != owner) || state == 4 && userAddress == owner && milestoneSummary!.timeLeftRound.toNumber() == 0) || (state == 2 && owner.toLowerCase() == userAddress)) ? (
                                        <Withdraw
                                            fundAddress={fundAddress}
                                            onChangeState={() => {
                                                updateUI()
                                            }}
                                            milestoneSummary={milestoneSummary}
                                            funderSummary={funderSummary}
                                            onGetFunderInfo={() => { updateFunderInfo() }}
                                        ></Withdraw>
                                    ) : (<></>)}
                                    {state == 2 && milestoneSummary.withdrawExpired ? (
                                        <WithdrawExpired
                                            fundAddress={fundAddress}
                                            onChangeState={() => {
                                                updateUI()
                                            }}
                                            milestoneSummary={milestoneSummary}
                                            funderSummary={funderSummary}
                                            onGetFunderInfo={() => { updateFunderInfo() }}
                                        ></WithdrawExpired>
                                    ) : (<></>)}
                                    {state == 1 ? (
                                        <Vote
                                            milestoneSummary={milestoneSummary}
                                            funderSummary={funderSummary}
                                            fundAddress={fundAddress}
                                            onGetFunderInfo={() => { updateFunderInfo() }}
                                        ></Vote>
                                    ) : <></>}
                                </div>

                            </div>
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
                        ></TabsContent>
                    </div>
                </div>
            ) : (
                <div>
                    <Head>
                        <title>Promise Fundraiser</title>
                        <meta name="description" content="Version one of the FundMe Smart Contract" />
                    </Head>
                </div>
            )
            }
        </div >
    )
}

export default Details2

