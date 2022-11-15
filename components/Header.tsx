import { ConnectButton } from "web3uikit"
import Image from "next/image"
import Link from "next/link"
import CategorySelector from "./CategorySelector"
import SearchBar from "material-ui-search-bar";
import styles from "../styles/Home.module.css"

export default function Header(props: { onChangeQuery?(arg0: string): void }) {
    return (
        <nav className="flex items-center justify-between flex-nowrap p-6 space-x-5">
            <Image
                src="https://firebasestorage.googleapis.com/v0/b/yieldme-39169.appspot.com/o/app%2Fimages%2Fpromise-logo.png?alt=media&token=b5d1d5aa-83c6-4b51-aa5b-e919ac3adcd1"
                alt="Picture of the author"
                width={100}
                height={100}
            />
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-lg lg:flex-grow flex flex-row  flex-nowrap ">
                    <SearchBar className={styles.searchbar} onChange={(query) => {
                        props.onChangeQuery!(query)
                    }}></SearchBar>

                    <CategorySelector></CategorySelector>

                    <Link href="/">
                        <a className="block mt-4 lg:inline-block lg:mt-0 text-slate-200 mr-4 rounded px-5 py-2 ">
                            Discover
                        </a>
                    </Link>

                    <Link href="/form" >
                        <a className={styles.newFundButton}>
                            Create New Fund
                        </a>
                    </Link>

                </div>
            </div>

            <div className="ml-auto py-2 px-2">
                <ConnectButton moralisAuth={true} />
            </div>
        </nav>
    )
}
