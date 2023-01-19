import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import Features from "../components/landingPage/Features"
import HowItWorks from "../components/landingPage/HowItWorks"
import Footer from "../components/landingPage/Footer"

const Discover: NextPage = () => {
    function handleScroll(section: string) {
        const element = document.getElementById(section);
        element!.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }

    return (
        <div>
            <Head>
                <title>Promise</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>


            <div className={styles.landingPageBackground}>
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/yieldme-39169.appspot.com/o/app%2Fimages%2Fpromise-logo.png?alt=media&token=8a440e85-05db-4da0-acb1-88d61d56c4f6"
                    alt="Picture of the author"
                    width={75}
                    height={75}
                    className={styles.promiseLogo}
                />
                <div className={styles.landingPageTitleBox}>
                    <h1 style={{ fontSize: "50px", fontWeight: "700" }}>Promise</h1>
                    <h2 style={{ fontSize: "30px" }}>Crowdfunding reimagined.</h2>

                </div>
                <div className={styles.launchAppOuter}>
                    <Link legacyBehavior href="/discover">
                        <a className={styles.launchAppInner}>
                            Launch App
                        </a>
                    </Link>
                </div>

                <div className={styles.launchPageHeader}>
                    <button type="button" className={styles.launchPageHeaderItem} onClick={(e) => {
                        handleScroll("about")
                    }}>About</button>
                    <button type="button" className={styles.launchPageHeaderItem} onClick={(e) => {
                        handleScroll("how-it-works")
                    }}>How It Works</button>
                    <button type="button" className={styles.launchPageHeaderItem} onClick={(e) => {
                        handleScroll("features")
                    }}>Features</button>
                    <div className={styles.launchPageHeaderItem}>Contact</div>
                    <Link className={styles.launchPageHeaderItem} href="https://github.com/PromiseFunding">GitHub
                    </Link>
                </div>


            </div>

            <div className={styles.landingPageSummary} id="about">
                <h2 style={{ fontSize: "40px" }}>A novel way to fund projects <b><i>trustlessly</i></b>.</h2>
                <h3 style={{ fontSize: "20px", marginTop: "20px" }}>Promise removes trust from the process of crowdfunding protocols by allowing the funders of a project to hold
                    the project&apos;s fundraisers accountable. Donors no longer have to wonder whether fundraisers will follow through on the
                    claims they make. Instead fundraisers are rewarded for proving they have done what they promised. </h3>
            </div>


            <HowItWorks></HowItWorks>
            <Features></Features>
            <Footer></Footer>
        </div >
    )
}

export default Discover
