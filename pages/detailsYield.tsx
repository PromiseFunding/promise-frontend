import type { NextPage } from "next"
import { abi } from "../constants"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import YieldDonation from "../components/YieldDonation"
import Withdraw from "../components/WithdrawFunder"
import WithdrawProceeds from "../components/WithdrawProceeds"
import PoolInfo from "../components/PoolInfo"
import StraightDonation from "../components/StraightDonation"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ref, onValue } from "firebase/database"
import { database } from "../firebase-config"
import { databaseFundObject } from "../config/types"
import { CardMedia } from "@mui/material"

const Details: NextPage = () => {
    const router = useRouter()
    const fundAddress = router.query.fund as string
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundRef = ref(database, chainId + "/funds/" + fundAddress)
    const [data, setData] = useState<databaseFundObject>()
    const [assetAddress, setAssetAddress] = useState("")
    const [userAddress, setAddress] = useState("0")
    const [owner, setOwner] = useState("0")
    const [amt, setAmt] = useState(0)

    const { runContractFunction: getOwner } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getOwner",
        params: {},
    })

    const { runContractFunction: getAssetAddress } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress, // specify the networkId
        functionName: "getAssetAddress",
        params: {},
    })

    const updateAmountTrigger = function () {
        setAmt(amt + 1)
    }

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

    async function updateUI() {
        const assetAddressFromCall = (await getAssetAddress()) as string
        setAssetAddress(assetAddressFromCall)
        const ownerFromCall = await getOwner()
        setOwner((ownerFromCall as string).toLowerCase())
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundAddress])

    return (
        <div className={styles.container}>
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
                                            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                                            <YieldDonation
                                                fundAddress={fundAddress}
                                                assetAddress={assetAddress}
                                                onChangeAmountFunded={() => updateAmountTrigger()}
                                            ></YieldDonation>
                                            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
                                        </>
                                    ) : (
                                        <p></p>
                                    )}
                                </div>
                            </div>
                        </div>
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
        </div>
    )
}

export default Details
