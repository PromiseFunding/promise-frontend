import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import Tutorial from "../components/Tutorial"

const Info: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Promise</title>
                <meta name="description" content="Crowdfunding Reimagined" />
            </Head>
            <Header main={false}></Header>
            <Tutorial></Tutorial>

        </div>
    )
}

export default Info
