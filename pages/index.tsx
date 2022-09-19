import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import Deposit from "../components/Deposit"
import Withdraw from "../components/WithdrawFunder"
import WithdrawProceeds from "../components/WithdrawProceeds"

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>YieldMe Version 1.0</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <Header></Header>
            <div className="p-5 flex flex-row">
                <Deposit></Deposit>
                <Withdraw></Withdraw>
                <WithdrawProceeds></WithdrawProceeds>
            </div>
        </div>
    )
}

export default Home
