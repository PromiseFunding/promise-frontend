import type { NextPage } from "next"
import { abi, contractAddresses } from "../constants"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import YieldDonation from "../components/YieldDonation"
import Withdraw from "../components/WithdrawFunder"
import WithdrawProceeds from "../components/WithdrawProceeds"
import StartVote from "../components/StartVote"
import PoolInfo from "../components/PoolInfo"
import StraightDonation from "../components/StraightDonation"
import SubmitVote from "../components/SubmitVote"
import EndVote from "../components/EndVote"
import StatusBar from "../components/StatusBar"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ref, onValue } from "firebase/database"
import { database } from "../firebase-config"
import { databaseFundObject } from "../config/types"
import { CardMedia } from "@mui/material"
import { states } from "../config/helper-config"
import { BigNumber } from "ethers"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"
import CurrentTrancheDonation from "../components/CurrentTrancheDonation"

const Details: NextPage = () => {
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


    const { runContractFunction: getOwner } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getOwner",
        params: {},
    })

    const { runContractFunction: getAssetAddress } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress,
        functionName: "getAssetAddress",
        params: {},
    })

    const { runContractFunction: getState } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress,
        functionName: "getState",
        params: {},
    })

    const { runContractFunction: getCurrentTranche } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress,
        functionName: "getCurrentTranche",
        params: {},
    })

    const { runContractFunction: getMilestoneDurations } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress,
        functionName: "getMilestoneDurations",
        params: {},
    })

    const { runContractFunction: getTimeLeftMilestone } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress,
        functionName: "getTimeLeftMilestone",
        params: {},
    })

    const { runContractFunction: getTotalFunds } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress,
        functionName: "getTotalFunds",
        params: {},
    })

    useEffect(() => {
        onValue(fundRef, (snapshot) => {
            setData(snapshot.val())
        })
    }, [fundAddress])

    useEffect(() => {
        if (account) {
            setAddress(account.toLowerCase())
            //updateUI()
        }
    }, [account])

    async function updateUI() {
        const assetAddressFromCall = (await getAssetAddress()) as string
        setAssetAddress(assetAddressFromCall)
        const ownerFromCall = await getOwner()
        setOwner((ownerFromCall as String).toLowerCase())
        const stateFromCall = await getState() as number
        setState(stateFromCall)
        const trancheFromCall = await getCurrentTranche() as number
        setTranche(trancheFromCall)
        const timeLeftFromCall = await getTimeLeftMilestone() as BigNumber
        setTimeLeft(timeLeftFromCall.toNumber())
        const totalFromCall = await getTotalFunds() as BigNumber
        setTotalFunds(totalFromCall.toNumber() / 10 ** decimals!)
        const durationsFromCall = await getMilestoneDurations()
        setMilestoneDurations((durationsFromCall as BigNumber[]).map(num => num.toNumber()))
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundAddress])


    return (
        <div className={styles.container}>
            <Head>
                <title>Promise</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <Header main={false}></Header>
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
                                <br></br>
                                <div>
                                    <h1 className="text-2xl font-bold">Total Amount Raised:</h1>
                                    <h1 className="text-2xl font-bold">{totalFunds} {coinName}</h1>
                                </div>
                                <br></br>
                                <br></br>
                                <div className="font-bold">
                                    <div className="font-normal">
                                        {" "}
                                        <b className="text-2xl">Category:</b> {data.category}
                                    </div>
                                </div>
                                <div className="font-bold">
                                    <div className="font-normal">
                                        {" "}
                                        <b className="text-2xl">Fund State:</b> {states[state]}
                                    </div>
                                </div>
                                <div className="font-bold">
                                    <div className="font-normal">
                                        {" "}
                                        <b className="text-2xl">Current Milestone:</b> {tranche + 1}
                                    </div>
                                </div>
                                <div className="font-bold">
                                    <div className="font-normal">
                                        {" "}
                                        <b className="text-2xl">Time Left in Milestone:</b> {timeLeft}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.sticky}>
                                <div className="text-center flex flex-col border-2 border-slate-500">

                                    <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                                    {isWeb3Enabled ? (
                                        <>
                                            {/* FOR NON OWNERS: */}
                                            {owner != userAddress ? (
                                                <div>
                                                    {state == 0 ? (
                                                        <><div>
                                                            <StraightDonation
                                                                fundAddress={fundAddress}
                                                                assetAddress={assetAddress}
                                                                ownerFund={owner}
                                                                decimals={decimals!}
                                                                coinName={coinName}
                                                                onChangeAmountFunded={() => {
                                                                    updateUI()
                                                                }}
                                                                totalRaised={totalFunds}
                                                                tranche={tranche}
                                                            ></StraightDonation>
                                                            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                                                            <div className="text-center flex flex-col border-2 border-slate-500">
                                                                <CurrentTrancheDonation
                                                                    fundAddress={fundAddress}
                                                                    assetAddress={assetAddress}
                                                                    ownerFund={owner}
                                                                    tranche={tranche}
                                                                    decimals={decimals!}
                                                                    coinName={coinName}
                                                                    onChangeAmountFunded={() => {
                                                                        updateUI()
                                                                    }}
                                                                    totalRaised={totalFunds}
                                                                ></CurrentTrancheDonation>
                                                            </div>
                                                        </div>
                                                            <div>
                                                                {timeLeft == 0 ? (
                                                                    <StartVote
                                                                        fundAddress={fundAddress}
                                                                        assetAddress={assetAddress}
                                                                        onChangeState={() => {
                                                                            updateUI()
                                                                        }}
                                                                    ></StartVote>
                                                                ) : (<></>)}
                                                            </div></>
                                                    ) : (<></>)}
                                                    {state == 1 ? (
                                                        <div>
                                                            <SubmitVote
                                                                fundAddress={fundAddress}
                                                                assetAddress={assetAddress}
                                                            ></SubmitVote>
                                                            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

                                                            <EndVote
                                                                fundAddress={fundAddress}
                                                                assetAddress={assetAddress}
                                                                onChangeState={() => {
                                                                    updateUI()
                                                                }}
                                                            ></EndVote>
                                                        </div>

                                                    ) : (
                                                        <></>
                                                    )}
                                                    {state == 2 ? (<h1 className="p-5 text-2xl font-bold bg-slate-800">
                                                        The funders of this project have voted to approve the funds for this
                                                        milestone to be released. The owner will now be able to withdraw the funds.</h1>
                                                    ) : (<></>)}

                                                    <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                                                    <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

                                                    {state == 3 ? (
                                                        <Withdraw
                                                            fundAddress={fundAddress}
                                                            assetAddress={assetAddress}
                                                            updateAmount={amt}
                                                        ></Withdraw>
                                                    ) : (<></>)}
                                                </div>
                                            ) : (
                                                <div>
                                                    {/* FOR OWNERS: */}
                                                    {state == 0 ? (
                                                        <StartVote
                                                            fundAddress={fundAddress}
                                                            assetAddress={assetAddress}
                                                            onChangeState={() => {
                                                                updateUI()
                                                            }}
                                                        ></StartVote>
                                                    ) : (<></>)}

                                                    {state == 1 ? (<div>
                                                        <h1 className="p-5 text-2xl font-bold bg-slate-800">

                                                            There is currently a vote going on.
                                                            You must wait for the vote to complete before
                                                            you can take another action.</h1>

                                                        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />


                                                        <EndVote
                                                            fundAddress={fundAddress}
                                                            assetAddress={assetAddress}
                                                            onChangeState={() => {
                                                                updateUI()
                                                            }}
                                                        ></EndVote>
                                                    </div>
                                                    ) : (<></>)}

                                                    {state == 2 ? (
                                                        <WithdrawProceeds
                                                            fundAddress={fundAddress}
                                                            assetAddress={assetAddress}
                                                            ownerFund={owner}
                                                            tranche={tranche}
                                                            onChangeState={() => {
                                                                updateUI()
                                                            }}
                                                        ></WithdrawProceeds>
                                                    ) : (<></>)}

                                                    {state == 3 ? (<h1 className="p-5 text-2xl font-bold bg-slate-800">
                                                        The funders of this project have decided to close down this fundraiser.
                                                        They will now be able to withdraw their funds.</h1>
                                                    ) : (<></>)}
                                                </div>
                                            )}

                                        </>
                                    ) : (
                                        <p></p>
                                    )}

                                </div>

                            </div>

                        </div>
                        <StatusBar
                            fundAddress={fundAddress}
                            tranche={tranche}
                            milestoneDurations={milestoneDurations}
                            ownerFund={owner}
                            decimals={decimals!}
                            userAddress={userAddress}
                            currState={state}
                            totalRaised={totalFunds}
                            coinName={coinName}
                        ></StatusBar>

                    </div>
                ) : (
                    <div></div>
                )}
                <div className="p-10">
                    <PoolInfo
                        fundAddress={router.query.fund as string}
                        assetAddress={assetAddress}
                    />
                </div>
            </div>
        </div >
    )
}

export default Details
