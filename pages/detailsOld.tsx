import type { NextPage } from "next"
import { abi, contractAddresses } from "../constants"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import YieldDonation from "../components/YieldDonation"
import Withdraw from "../components/WithdrawFunder"
import WithdrawProceeds from "../components/WithdrawProceeds"
import StartVote from "../components/StartVote"
import PoolInfo from "../components/details/PoolInfo"
import StraightDonation from "../components/StraightDonation"
import SubmitVote from "../components/SubmitVote"
import EndVote from "../components/EndVote"
import StatusBar from "../components/details/StatusBar"
import CommunityForum from "../components/details/CommunityForum"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract, useMoralisWeb3ApiCall, useMoralisWeb3Api } from "react-moralis"
import { ref, onValue } from "firebase/database"
import { database } from "../firebase-config"
import { databaseFundObject, milestoneSummary, milestone, funderSummary } from "../config/types"
import { CardMedia } from "@mui/material"
import { states } from "../config/helper-config"
import { BigNumber } from "ethers"
import { contractAddressesInterface, propType } from "../config/types"
import { tokenConfig } from "../config/token-config"
import CurrentTrancheDonation from "../components/CurrentTrancheDonation"
import Updates from "../components/details/Updates"

const DetailsOld: NextPage = () => {
    const router = useRouter()
    const fundAddress = router.query.fund as string

    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundRef = ref(database, chainId + "/funds/" + fundAddress)
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
                                        {state != 4 ? (timeLeft <= 0 ? (<><b className="text-2xl">Fund State:</b> Milestone period ended. Not accepting more Donations. Waiting for vote to start.</>) :
                                            (<><b className="text-2xl">Fund State:</b> {states[state]} </>))
                                            : (timeLeft <= 0 ? (<><b className="text-2xl">Fund State:</b> Not accepting more Seed Round Donations. Waiting on owner to start milestone funding process.</>) :
                                                (<><b className="text-2xl">Fund State:</b> {states[state]} </>))
                                        }
                                    </div>
                                </div>
                                <div className="font-bold">
                                    <div className="font-normal">
                                        {state == 4 ? (
                                            <><b className="text-2xl">Current Stage:</b> Seed Funding</>
                                        ) : (
                                            <><b className="text-2xl">Current Stage:</b> Milestone {tranche + 1}</>
                                        )}
                                    </div>
                                </div>
                                <div className="font-bold">
                                    <div className="font-normal">
                                        {state == 4 ? (
                                            <><b className="text-2xl">Time Left in Seed Funding Round:</b> {timeLeft}</>
                                        ) : (
                                            <><b className="text-2xl">Time Left in Milestone Round:</b> {timeLeft}</>
                                        )}
                                    </div>
                                </div>
                                <div className="font-bold">
                                    <div className="font-normal">
                                        <b className="text-2xl">Votes Tried:</b> {numVotesTried}
                                        <br></br>
                                        {funderCalledVote || numVotesTried >= 2 ? (
                                            <><b className="text-2xl">Last vote of round. Result of this vote is final.</b></>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                                <div className="font-bold">
                                    <div className="font-normal">
                                        {state == 1 ? (
                                            <><b className="text-2xl">Time Left in Voting Period:</b> {timeLeftVoting}</>
                                        ) : (
                                            <></>
                                        )}
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
                                                            {timeLeft > 0 ? (
                                                                <><StraightDonation
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
                                                                    currState={state}
                                                                    onGetFunderInfo={() => { updateFunderInfo() }}
                                                                    funderSummary={funderSummary}
                                                                ></StraightDonation>
                                                                    <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                                                                    <div className="text-center flex flex-col">
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
                                                                            onGetFunderInfo={() => { updateFunderInfo() }}
                                                                            funderSummary={funderSummary}
                                                                            totalRaised={totalFunds}
                                                                        ></CurrentTrancheDonation>
                                                                    </div></>
                                                            ) : (<><h1 className="p-5 text-2xl font-bold bg-slate-800">Milestone Round ended. Not accepting donations.</h1></>)}
                                                        </div>
                                                            <div>
                                                                {timeLeft <= 0 ? (
                                                                    <StartVote
                                                                        fundAddress={fundAddress}
                                                                        assetAddress={assetAddress}
                                                                        onChangeState={() => {
                                                                            updateUI()
                                                                        }}
                                                                        tranche={tranche}
                                                                        ownerFund={owner}
                                                                        decimals={decimals!}
                                                                        onGetFunderInfo={() => { updateFunderInfo() }}
                                                                        funderSummary={funderSummary}
                                                                    ></StartVote>
                                                                ) : (<></>)}
                                                            </div></>
                                                    ) : (<></>)}
                                                    {state == 1 ? (
                                                        <div>
                                                            <SubmitVote
                                                                fundAddress={fundAddress}
                                                                assetAddress={assetAddress}
                                                                tranche={tranche}
                                                                decimals={decimals!}
                                                                onGetFunderInfo={() => { updateFunderInfo() }}
                                                                funderSummary={funderSummary}
                                                            ></SubmitVote>
                                                            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />

                                                            <EndVote
                                                                fundAddress={fundAddress}
                                                                assetAddress={assetAddress}
                                                                onChangeState={() => {
                                                                    updateUI()
                                                                }}
                                                                tranche={tranche}
                                                                decimals={decimals!}
                                                                ownerFund={owner}
                                                                timeLeftVoting={timeLeftVoting}
                                                                onGetFunderInfo={() => { updateFunderInfo() }}
                                                                funderSummary={funderSummary}
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
                                                            onGetFunderInfo={() => { updateFunderInfo() }}
                                                            funderSummary={funderSummary}
                                                            tranche={tranche}
                                                        ></Withdraw>
                                                    ) : (<></>)}

                                                    {state == 4 ? (timeLeft > 0 ? (
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
                                                            currState={state}
                                                            onGetFunderInfo={() => { updateFunderInfo() }}
                                                            funderSummary={funderSummary}
                                                        ></StraightDonation>) : (<h1 className="p-5 text-2xl font-bold bg-slate-800">Seed Round ended. Not accepting donations.</h1>)
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
                                                            tranche={tranche}
                                                            ownerFund={owner}
                                                            decimals={decimals!}
                                                            onGetFunderInfo={() => { updateFunderInfo() }}
                                                            funderSummary={funderSummary}
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
                                                            tranche={tranche}
                                                            decimals={decimals!}
                                                            ownerFund={owner}
                                                            timeLeftVoting={timeLeftVoting}
                                                            onGetFunderInfo={() => { updateFunderInfo() }}
                                                            funderSummary={funderSummary}
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
                                                            currState={state}
                                                            milestoneSummary={milestoneSummary}
                                                        ></WithdrawProceeds>
                                                    ) : (<></>)}

                                                    {state == 3 ? (<h1 className="p-5 text-2xl font-bold bg-slate-800">
                                                        The funders of this project have decided to close down this fundraiser.
                                                        They will now be able to withdraw their funds.</h1>
                                                    ) : (<></>)}

                                                    {state == 4 ? ((timeLeft <= 0) ? (
                                                        <><WithdrawProceeds
                                                            fundAddress={fundAddress}
                                                            assetAddress={assetAddress}
                                                            ownerFund={owner}
                                                            tranche={tranche}
                                                            onChangeState={() => {
                                                                updateUI()
                                                            }}
                                                            currState={state}
                                                            milestoneSummary={milestoneSummary}
                                                        ></WithdrawProceeds><h1 className="p-5 text-2xl font-bold bg-slate-800">
                                                                You can now withdraw your seed round funding. This will immediately start your first milestone and the milestone funding process.</h1></>
                                                    ) : (<><h1 className="p-5 text-2xl font-bold bg-slate-800">
                                                        You are currently in the Seed Funding Phase of your project. All donations will go to you and the ability
                                                        to withdraw will become available after the Seed Funding Phase ends.</h1></>)) : (<></>)}
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
                            milestoneSummary={milestoneSummary}
                        ></StatusBar>
                        <Updates
                            fundAddress={fundAddress}
                            ownerFund={owner}
                        ></Updates>
                        <CommunityForum
                            fundAddress={fundAddress}
                            ownerFund={owner}
                            totalRaised={totalFunds}
                        ></CommunityForum>
                    </div>
                ) : (
                    <div></div>
                )}
                <div className="p-10">
                    <PoolInfo
                        fundAddress={router.query.fund as string}
                        milestoneSummary={milestoneSummary}
                    />
                </div>
            </div>
        </div >
    )
}

export default DetailsOld
