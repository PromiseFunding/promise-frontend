import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import FundsListed from "../components/FundsListed"
import * as React from "react"

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>YieldMe Version 1.0</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <Header></Header>
            <br></br>
            <div>
                <h1 className="font-blog text-4xl text-slate-200">Discover Fundraisers</h1>
            </div>
            <br></br>
            <br></br>
            <FundsListed></FundsListed>
        </div>
    )
}

export default Home
