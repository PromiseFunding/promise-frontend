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

const Details2: NextPage = () => {
    const router = useRouter()
    const fundAddress = router.query.fund as string

    const fundRef = ref(database, "funds/" + fundAddress)
    const [data, setData] = useState<databaseFundObject>()
    const [assetAddress, setAssetAddress] = useState("")
    const [userAddress, setAddress] = useState("0")
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

    useEffect(() => {
        onValue(fundRef, (snapshot) => {
            setData(snapshot.val())
        })
    }, [fundAddress])

    useEffect(() => {
        if (account) {
            setAddress(account.toLowerCase())
        }
    }, [account])

    function getDurations(milestones: milestone[]): number[] {
        return milestones.map(milestone => milestone!.milestoneDuration!.toNumber())
    }

    async function updateFunderInfo() {
        const funderInfo = await getFunderSummary() as funderSummary
        setFunderSummary(funderInfo)
        updateUI()
    }

    useEffect(() => {
        if (funderParam && levelParam >= 0) {
            updateFunderInfo()
            setFunderParam("")
            setLevelParam(-1)
        }
    }, [funderParam, levelParam])

    async function updateUI() {
        const milestoneInfo = await getMilestoneSummary() as milestoneSummary
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
            updateUI()
        }
    }, [isWeb3Enabled, fundAddress])

    return (
        <div>

            <Header main={false}></Header>
            {data ? (
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
                                <StateStatus fundAddress={fundAddress} milestoneSummary={milestoneSummary} format="details"></StateStatus>
                                {(state != 1) ? (
                                    <Donate
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
                                        onGetFunderInfo={(funder, level) => {
                                            setFunderParam(funder)
                                            setLevelParam(level)
                                        }}
                                        funderSummary={funderSummary}
                                        assetAddress={assetAddress}
                                    ></Donate>
                                ) :
                                    (<></>)
                                }

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

