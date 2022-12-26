import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import { useEffect, useState } from "react"
import Search from "../components/Search"
import CategorySelector from "../components/CategorySelector"
import SortSelector from "../components/SortingSearch"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { contractAddressesInterface } from "../config/types"
import { contractAddresses, FundFactory } from "../constants"
import { ref, get } from "firebase/database"
import { database } from "../firebase-config"
import * as React from "react"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import { useCallback } from "react"
import { Engine } from "tsparticles-engine"

const Discover: NextPage = () => {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

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

    //TODO: get helper-config working instead!... gets rid of decimal function
    const [allFunds, setAllFunds] = useState<string[]>([])
    const [query, setQuery] = useState("")

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
        if (isWeb3Enabled && fundFactoryAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundFactoryAddress])

    const options = {
        // background: {
        //     color: "#fff",
        // },
        particles: {
            shape: {
                type: "circle",
            },
            number: {
                value: 7,
            },
            color: {
                // value: "random",
                //value: ["#0A1A6A", "#A42525"]
                value: "#A42525",
            },
            opacity: {
                value: 0.3,
            },
            size: {
                value: { min: 30, max: 50 },
            },
            move: {
                enable: true,
                speed: 0.25,
                random: false,
            },
            bounds: {
                top: 500,
            },
        },
    }

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine)
    }, [])

    return (
        <div>
            {/* <Particles options={options} init={particlesInit} style={{ zIndex: -1 }} /> */}
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
                    }}
                >
                    Fundraisers We Love...
                </h1>
            </div>
            <br></br>
            <div>
                <CategorySelector></CategorySelector>
                {/* <SortSelector></SortSelector> */}
            </div>
            {isWeb3Enabled && fundFactoryAddress ? (
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
