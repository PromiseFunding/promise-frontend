import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import { useEffect, useState } from "react"
import Search from "../components/Search"
import CategorySelector from "../components/CategorySelector"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddressesInterface } from "../config/types"
import { contractAddresses, FundFactory, YieldFundFactory } from "../constants"
import { ref, get } from "firebase/database"
import { database } from "../firebase-config"
import * as React from "react"
import Typed from "react-typed"
import { ethers } from "ethers";
import { DEFAULT_CHAIN_ID } from "../config/helper-config"

const Discover: NextPage = () => {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = chainIdHex ? parseInt(chainIdHex!).toString() : DEFAULT_CHAIN_ID

    const rpcUrl = chainId == "421613" ? process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_RPC_URL : "http://localhost:8545"
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    const signer = provider

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    })

    const fundFactoryAddress =
        chainId in addresses
            ? addresses[chainId]["PromiseFundFactory"][
            addresses[chainId]["PromiseFundFactory"].length - 1
            ]
            : null

    const yieldAddress =
        chainId in addresses
            ? addresses[chainId]["FundFactory"][addresses[chainId]["FundFactory"].length - 1]
            : null

    //TODO: get helper-config working instead!... gets rid of decimal function
    const [allFunds, setAllFunds] = useState<string[]>([])
    const [query, setQuery] = useState("")

    const getAllPromiseFund = async () => {
        const contract = new ethers.Contract(fundFactoryAddress!, FundFactory as any[], signer)

        const getResult = async () => {
            const result = await contract.getAllPromiseFund()
            return result
        }

        return getResult()
    }

    const getAllYieldFundsAAVE = async () => {
        const contract = new ethers.Contract(yieldAddress!, YieldFundFactory as any[], signer)

        const getResult = async () => {
            const result = await contract.getAllYieldFundsAAVE()
            return result
        }

        return getResult()
    }

    async function updateUI() {
        const allPromiseFundsFromCall = (await getAllPromiseFund()) as string[]
        const allYieldFundsFromCall = (await getAllYieldFundsAAVE()) as string[]
        const allFundsFromCall: string[] = allPromiseFundsFromCall.concat(allYieldFundsFromCall)
        const finalFunds: string[] = []
        if (allFundsFromCall) {
            for (const fund of allFundsFromCall) {
                const categoryRef = ref(database, chainId + "/funds/" + fund + "/fundTitle")
                const snapshot = await get(categoryRef)

                if (snapshot.val()) {
                    finalFunds.push(fund)
                }
            }
        }
        setAllFunds(finalFunds)
    }

    useEffect(() => {
        if (fundFactoryAddress) {
            updateUI()
        }
    }, [fundFactoryAddress])

    return (
        <div>
            <Head>
                <title>Promise</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <Header
                onChangeQuery={(queryString) => {
                    setQuery(queryString)
                }}
                main={true}
            ></Header>
            <div className={styles.fundsWeLove}>
                <h1
                    style={{
                        position: "relative",
                        fontWeight: "700",
                        display: "table-cell",
                        verticalAlign: "middle",
                        height: "100%",
                    }}
                >
                    Fundraisers
                    <Typed
                        strings={[" ", " We Love...", " We Care About...", " That Matter."]}
                        typeSpeed={150}
                        backSpeed={150}
                        backDelay={1500}
                        loop
                    />
                </h1>
            </div>
            <br></br>
            <div>
                <CategorySelector></CategorySelector>
            </div>
            {fundFactoryAddress ? (
                <>
                    <div>
                        <Search fundAddressArray={allFunds} query={query}></Search>
                    </div>
                </>
            ) : (
                <div>Not available on this chain</div>
            )}
        </div>
    )
}

export default Discover
