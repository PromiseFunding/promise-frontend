import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import { useEffect, useState } from "react"
import Search from "../components/Search"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddressesInterface } from "../config/types"
import { contractAddresses, FundFactory } from "../constants"
import { ref, get } from "firebase/database"

import { database } from "../firebase-config"

const Home: NextPage = () => {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundFactoryAddress =
        chainId in addresses
            ? addresses[chainId]["PromiseFundFactory"][addresses[chainId]["PromiseFundFactory"].length - 1]
            : null

    //TODO: get helper-config working instead!... gets rid of decimal function
    const [allFunds, setAllFunds] = useState<string[]>([])

    const { runContractFunction: getAllPromiseFund } = useWeb3Contract({
        abi: FundFactory,
        contractAddress: fundFactoryAddress!,
        functionName: "getAllPromiseFund",
        params: {},
    })

    async function updateUI() {
        const allFundsFromCall = (await getAllPromiseFund()) as string[]
        const finalFunds: string[] = []
        if (allFundsFromCall) {
            for (const fund of allFundsFromCall) {
                const categoryRef = ref(database, "funds/" + fund + "/fundTitle")
                const snapshot = await get(categoryRef)

                if (snapshot.val()) {
                    finalFunds.push(fund)
                }
            }
        }
        setAllFunds(finalFunds)
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
                <>
                    <div>
                        <Search fundAddressArray={allFunds}></Search>
                    </div>
                </>
            ) : (
                <div>Not available on this chain</div>
            )}
        </div>
    )
}

export default Home
