import MyFundraisers from "../components/MyFundraisers"
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
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import { useCallback } from "react"
import { Engine } from "tsparticles-engine"

const MyFunds: NextPage = () => {
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()

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
            <Header main={false}></Header>
            <div className={styles.yourFunds}>
                <h1
                    style={{
                        position: "relative",
                        fontWeight: "700",
                        display: "table-cell",
                        verticalAlign: "middle",
                    }}
                >
                    Your Fundraisers
                </h1>
            </div>
            <br></br>
            {isWeb3Enabled && account ? (
                <>
                    <div>
                        <MyFundraisers></MyFundraisers>
                    </div>
                </>
            ) : (
                <div>Not available on this chain</div>
            )}
        </div>
    )
}

export default MyFunds
