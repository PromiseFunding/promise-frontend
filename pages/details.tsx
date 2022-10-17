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

const Details: NextPage = () => {
    const router = useRouter()
    const fundAddress = router.query.fund as string

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
            <h1 className="text-slate-200">Fund Address: {router.query.fund}</h1>
            <div className="p-5 text-center flex flex-col">
                <RegularDonation
                    fundAddress={fundAddress}
                    assetAddress={assetAddress}
                ></RegularDonation>
                <Deposit fundAddress={fundAddress} assetAddress={assetAddress}></Deposit>
                <Withdraw fundAddress={fundAddress} assetAddress={assetAddress}></Withdraw>
                <WithdrawProceeds
                    fundAddress={fundAddress}
                    assetAddress={assetAddress}
                ></WithdrawProceeds>
            </div>
            <div>
                <PoolInfo
                    fundAddress={router.query.fund as string}
                    assetAddress={assetAddress}
                ></PoolInfo>
            </div>
        </div>
    )
}

export default Details
