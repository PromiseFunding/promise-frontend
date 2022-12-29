import { ConnectButton } from "web3uikit"
import Image from "next/image"
import Link from "next/link"
import CategorySelector from "./CategorySelector"
import SearchBar from "material-ui-search-bar"
import styles from "../styles/Home.module.css"
import Drawer from "../components/discover/Drawer"

export default function Header(props: { onChangeQuery?(arg0: string): void; main: boolean }) {
    return (
        <nav className={styles.header}>
            <div className={styles.drawer}>
                <Drawer></Drawer>
            </div>
            <Image
                src="https://firebasestorage.googleapis.com/v0/b/yieldme-39169.appspot.com/o/app%2Fimages%2Fpromise-logo.png?alt=media&token=8a440e85-05db-4da0-acb1-88d61d56c4f6"
                alt="Picture of the author"
                width={75}
                height={75}
                style={{ marginRight: "20px" }}
            />
            <div className={styles.headerMain}>
                <div className="text-lg lg:flex-grow flex flex-row flex-nowrap ">
                    {props.main ? (
                        <>
                            <SearchBar
                                style={{ boxShadow: "0px 0px 2px 0.5px rgba(0,0,0,0.25)" }}
                                className={styles.searchbar}
                                onChange={(query) => {
                                    props.onChangeQuery!(query)
                                }}
                            ></SearchBar>
                            <div className={styles.headerInner}>
                                <div className={styles.headerFix}>
                                    <Link legacyBehavior href="/discover">
                                        <a className={styles.headerItem}>Discover</a>
                                    </Link>
                                    <Link legacyBehavior href="/info">
                                        <a className={styles.headerItem}>How It Works</a>
                                    </Link>
                                    <Link legacyBehavior href="/myfunds">
                                        <a className={styles.headerItem}>My Fundraisers</a>
                                    </Link>
                                    <Link legacyBehavior href="/form">
                                        <a className={styles.newFundButton}>Create New Fund</a>
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.headerInner}>
                                <Link legacyBehavior href="/discover">
                                    <a className={styles.headerItem}>Discover</a>
                                </Link>
                                <Link legacyBehavior href="/info">
                                    <a className={styles.headerItem}>How It Works</a>
                                </Link>
                                <Link legacyBehavior href="/myfunds">
                                    <a className={styles.headerItem}>My Fundraisers</a>
                                </Link>
                                <Link legacyBehavior href="/form">
                                    <a className={styles.newFundButton}>Create New Fund</a>
                                </Link>
                            </div>
                        </>
                    )}
                    {/* <div className={styles.headerInner}>
                        <Link legacyBehavior href="/discover">
                            <a className={styles.headerItem}>Discover</a>
                        </Link>
                        <Link legacyBehavior href="/info">
                            <a className={styles.headerItem}>How It Works</a>
                        </Link>
                        <Link legacyBehavior href="/myfunds">
                            <a className={styles.headerItem}>My Fundraisers</a>
                        </Link>
                        <Link legacyBehavior href="/form">
                            <a className={styles.newFundButton}>Create New Fund</a>
                        </Link>
                    </div> */}
                </div>
            </div>

            <div className="ml-auto">
                <ConnectButton
                    moralisAuth={true}
                />
            </div>
        </nav>
    )
}
