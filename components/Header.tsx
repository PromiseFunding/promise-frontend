import { ConnectButton } from "web3uikit"
import Image from "next/image"
import Link from "next/link"
import CategorySelector from "./CategorySelector"
import SearchBar from "material-ui-search-bar";
import styles from "../styles/Home.module.css"

export default function Header(props: { onChangeQuery?(arg0: string): void, main: boolean }) {
    return (
        <nav className="flex items-center justify-between flex-nowrap p-6 space-x-5">
            <Image
                src="https://firebasestorage.googleapis.com/v0/b/yieldme-39169.appspot.com/o/app%2Fimages%2Fpromise-logo.png?alt=media&token=8a440e85-05db-4da0-acb1-88d61d56c4f6"
                alt="Picture of the author"
                width={100}
                height={100}
            />
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-lg lg:flex-grow flex flex-row  flex-nowrap ">
                    {props.main ? (<SearchBar className={styles.searchbar} onChange={(query) => {
                        props.onChangeQuery!(query)
                    }}></SearchBar>) : (<></>)}


                    <CategorySelector></CategorySelector>

                    <Link legacyBehavior href="/">
                        <a className={styles.headerItem}>
                            Discover
                        </a>
                    </Link>

                    <Link legacyBehavior href="/info">
                        <a className={styles.headerItem}>
                            How It Works
                        </a>
                    </Link>

                    <Link legacyBehavior href="/form" >
                        <a className={styles.newFundButton}>
                            Create New Fund
                        </a>
                    </Link>

                </div>
            </div>

            <div className="ml-auto py-2 px-2">
                <ConnectButton moralisAuth={true} />
            </div>
        </nav >
    )
}
