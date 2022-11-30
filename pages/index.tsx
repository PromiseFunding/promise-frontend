import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Image from "next/image"
import Link from "next/link"
import Tutorial from "../components/Tutorial"

const Discover: NextPage = () => {

    return (
        <div >
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
                    style={{ marginLeft: "20px", marginTop: "20px" }}
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
                    <div className={styles.launchPageHeaderItem}>About</div>
                    <div className={styles.launchPageHeaderItem}>Features</div>
                    <div className={styles.launchPageHeaderItem}>Examples</div>
                    <div className={styles.launchPageHeaderItem}>Contact</div>
                </div>


            </div>



            <div style={{ height: "500px" }} ></div>
        </div >
    )
}

export default Discover
