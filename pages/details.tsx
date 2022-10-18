import type { NextPage } from "next"
import { abi } from "../constants"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import Deposit from "../components/Deposit"
import Withdraw from "../components/WithdrawFunder"
import WithdrawProceeds from "../components/WithdrawProceeds"
import PoolInfo from "../components/PoolInfo"
import RegularDonation from "../components/RegularDonation"
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

    const fundRef = ref(database, "funds/" + fundAddress)

    const [data, setData] = useState<databaseFundObject>()

    useEffect(() => {
        onValue(fundRef, (snapshot) => {
            setData(snapshot.val())
        })
    }, [fundAddress])

    const { isWeb3Enabled } = useMoralis()

    const { runContractFunction: getAssetAddress } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress, // specify the networkId
        functionName: "getAssetAddress",
        params: {},
    })

    const [assetAddress, setAssetAddress] = useState("")

    async function updateUI() {
        const assetAddressFromCall = (await getAssetAddress()) as string
        setAssetAddress(assetAddressFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundAddress])

    return (
        <div className={styles.container}>
            <Head>
                <title>YieldMe Version 1.0</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <Header></Header>
            <br></br>
            <div className="p-5 bg-slate-800 text-slate-200 rounded border-2 border-slate-500">
                {data ? (
                    <div>
                        <h1 className="p-5 text-8xl text-center font-bold text-slate-200">
                            {data.fundTitle}
                        </h1>
                        <div className={styles.details}>
                            <div className="rounded border-2 p-5 border-slate-500">

                                <br></br>
                                <div>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        width="140"
                                        image={data.imageURL}
                                        alt="fundraiser"
                                        sx={{
                                            width: 450,
                                            height: 450,
                                        }}
                                    />
                                </div>
                                <br></br>
                                <div className="font-bold">
                                    <h1 className="text-2xl">Description:</h1>
                                    <div className="font-normal">{data.description}</div>
                                </div>
                                <br></br>
                                <div className="font-bold">

                                    <div className="font-normal"> <b>Category:</b> {data.category}</div>
                                </div>

                            </div>
                            <div className="position-sticky">
                                <div className="text-center flex flex-col">
                                    <WithdrawProceeds
                                        fundAddress={fundAddress}
                                        assetAddress={assetAddress}
                                    ></WithdrawProceeds>
                                    <RegularDonation
                                        fundAddress={fundAddress}
                                        assetAddress={assetAddress}
                                    ></RegularDonation>
                                    <Deposit
                                        fundAddress={fundAddress}
                                        assetAddress={assetAddress}
                                    ></Deposit>
                                    <Withdraw
                                        fundAddress={fundAddress}
                                        assetAddress={assetAddress}
                                    ></Withdraw>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                        <div></div>
                    )}

            </div>
            <PoolInfo
                fundAddress={router.query.fund as string}
                assetAddress={assetAddress}
            />
        </div>
    )
}

export default Details
