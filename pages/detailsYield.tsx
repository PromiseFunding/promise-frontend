import type { NextPage } from "next"
import { abi, contractAddresses, yieldAbi } from "../constants"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ref, onValue } from "firebase/database"
import { database } from "../firebase-config"
import { databaseFundObject, fundSummary, funderSummary} from "../config/types"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"
import styles from "../styles/details/details.module.css"
import Image from "next/image"
import Button from "@mui/material/Button"
import Head from "next/head"
import Header from "../components/Header"
import StateStatusYield from "../components/discover/StateStatusYield"
import TabsContent from "../components/details/TabsContent"
import Donate from "../components/details/Donate"
import Withdraw from "../components/details/Withdraw"


const Details: NextPage = () => {
    const router = useRouter()
    const fundAddress = router.query.fund as string
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundRef = ref(database, chainId + "/funds/" + fundAddress)
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
    const [fundSummary, setFundSummary] = useState<fundSummary>()
    const [funderSummary, setFunderSummary] = useState<funderSummary>()

    const [funderParam, setFunderParam] = useState("")
    const [levelParam, setLevelParam] = useState(0)
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

    const {
        runContractFunction: getFunderSummary,
    } = useWeb3Contract({
        abi: yieldAbi,
        contractAddress: fundAddress!,
        functionName: "getFunderSummary",
        params: { funder: funderParam },
    })

    async function updateFunderInfo() {
        const funderInfo = (await getFunderSummary()) as funderSummary
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

            <Head>
                <title>YieldMe Version 1.0</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <br></br>
            <div className="p-5 bg-slate-700 text-slate-200 rounded border-2 border-slate-500">
                {data ? (
                    <div>
                        <div className={styles.details}>
                            <div className="p-5 rounded content-center">
                                <h1 className="text-5xl font-bold text-slate-200">
                                    {data.fundTitle}
                                </h1>
                                <div className="py-5">
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        width="140"
                                        image={data.imageURL}
                                        alt="fundraiser"
                                        sx={{
                                            width: 800,
                                            height: 800,
                                        }}
                                    />
                                </div>
                                <br></br>
                                <div className="font-bold">
                                    <h1 className="text-2xl">Description:</h1>
                                    <br></br>
                                    <div className="font-normal">{data.description}</div>
                                </div>
                                <br></br>
                                <div className="font-bold">
                                    <div className="font-normal">
                                        {" "}
                                        <b className="text-2xl">Category:</b> {data.category}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.sticky}>
                                <div className="text-center flex flex-col border-2 border-slate-500">
                                    <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                                    {isWeb3Enabled && owner != userAddress ? (
                                        <>
                                            <Button className={styles.shareButton}>Share</Button>
                                            <Donate
                                                fundAddress={fundAddress}
                                                decimals={decimals!}
                                                fundSummary={fundSummary}
                                                funderSummary={funderSummary}
                                                onGetFunderInfo={() => {
                                                    updateFunderInfo()
                                                }}
                                            ></Donate>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {userAddress == owner ? (
                                        <Withdraw
                                            fundAddress={fundAddress}
                                            fundSummary={fundSummary}
                                            funderSummary={funderSummary}
                                            onGetFunderInfo={() => {
                                                updateFunderInfo()
                                            }}
                                        ></Withdraw>
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
