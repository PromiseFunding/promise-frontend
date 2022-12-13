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

const MyFunds: NextPage = () => {
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()

    return (
        <div>
            <Head>
                <title>Promise</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <Header main={false}></Header>
            <div className={styles.fundsWeLove}>
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
