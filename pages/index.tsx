import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import { useEffect, useState } from "react"
import Search from "../components/Search"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddressesInterface } from "../config/types"
import { contractAddresses, FundFactory } from "../constants"

const Home: NextPage = () => {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundFactoryAddress =
        chainId in addresses
            ? addresses[chainId]["FundFactory"][addresses[chainId]["FundFactory"].length - 1]
            : null

    //TODO: get helper-config working instead!... gets rid of decimal function
    const [allFunds, setAllFunds] = useState<string[]>([])

    const { runContractFunction: getAllYieldFundsAAVE } = useWeb3Contract({
        abi: FundFactory,
        contractAddress: fundFactoryAddress!,
        functionName: "getAllYieldFundsAAVE",
        params: {},
    })

    async function updateUI() {
        const allFundsFromCall = (await getAllYieldFundsAAVE()) as string[]
        setAllFunds(allFundsFromCall)
        console.log(allFunds)
    }

    useEffect(() => {
        if (isWeb3Enabled && fundFactoryAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundFactoryAddress])

    return (
        <div className={styles.container}>
            <Head>
                <title>YieldMe Version 1.0</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <Header></Header>
            {isWeb3Enabled && fundFactoryAddress ? (
            <><div>
                    <Search fundAddressArray={allFunds}></Search>
                </div><br></br></>
            ) : (
                <div>Not available on this chain</div>
            )}
        </div>
    )
}

export default Home
