import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import NewFund from "../components/Newfund"

const Form: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Promise</title>
                <meta name="description" content="Crowdfunding Reimagined" />
            </Head>
            <Header main={false}></Header>
            <div className="p-5 flex flex-col">
                <NewFund></NewFund>
            </div>
        </div>
    )
}

export default Form
