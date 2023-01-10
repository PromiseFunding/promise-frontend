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
import TabsContent from "../components/details/TabsContent"
import DonateYield from "../components/details/DonateYield"
import WithdrawYield from "../components/details/WithdrawYield"

const Details: NextPage = () => {
    const router = useRouter()
    const fundAddress = router.query.fund as string
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

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

    const [funderParam, setFunderParam] = useState("")
    const [userAddress, setUserAddress] = useState("")

    const addresses: contractAddressesInterface = contractAddresses

    //TODO: get helper-config working instead!... gets rid of decimal function
    const chainIdNum = parseInt(chainIdHex!)

    let coinName = "USDT"

    for (const coin in tokenConfig[chainIdNum]) {
        if (tokenConfig[chainIdNum][coin].assetAddress == assetAddress) {
            coinName = coin
        }
    }

    const decimals = chainId in addresses ? tokenConfig[chainIdNum][coinName].decimals : null

    const { runContractFunction: getFundSummary } = useWeb3Contract({
        abi: yieldAbi,
        contractAddress: fundAddress!,
        functionName: "getFundSummary",
        params: {},
    })

    const { runContractFunction: getFunderSummary } = useWeb3Contract({
        abi: yieldAbi,
        contractAddress: fundAddress!,
        functionName: "getFunderSummary",
        params: { funder: funderParam },
    })

    async function updateFunderInfo() {
        const funderInfo = (await getFunderSummary()) as funderSummaryYield
        setFunderSummary(funderInfo)
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
        if (funderParam) {
            updateFunderInfo()
        }
    }, [funderParam])

    useEffect(() => {
        onValue(fundRef, (snapshot) => {
            setData(snapshot.val())
        })
    }, [fundAddress, chainId])

    return (
        <div>
            <Header main={false}></Header>
            {data && fundSummary && funderSummary ? (
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
                            <div className={styles.actionsInner}>
                                <StateStatusYield
                                    fundAddress={fundAddress}
                                    fundSummary={fundSummary}
                                    decimals={decimals!}
                                    format="details"
                                ></StateStatusYield>
                                <div className={styles.buttons}>
                                    {userAddress != owner ? (
                                        <>
                                            <Button className={styles.shareButton}>Share</Button>
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
                        </div>
                    </div>
                    <div className={styles.contentLower}>
                        {/* <TabsContent
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
                        ></TabsContent> */}
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
