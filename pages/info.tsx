import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import Tutorial from "../components/Tutorial"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import { useCallback } from "react"
import { Engine } from "tsparticles-engine"
import AccordionFAQ from "../components/AccordionFAQ"
import Box from "@mui/material/Box"

const Info: NextPage = () => {

    return (
        <div>
            {/* <Particles options={options} init={particlesInit} style={{ zIndex: -1 }} /> */}
            <Head>
                <title>Promise</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <Header main={false}></Header>
            <Tutorial></Tutorial>
            <br></br>
            <br></br>
            <div className={styles.faqAccordion}>
                <AccordionFAQ></AccordionFAQ>
            </div>
        </div>
    )
}

export default Info
