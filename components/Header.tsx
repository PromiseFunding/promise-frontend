import { ConnectButton } from "web3uikit"
import Image from "next/image"
import Link from "next/link"
import CategorySelector from "./CategorySelector"

export default function Header() {
    return (
        <nav className=" border-b-2 flex items-center justify-between flex-wrap p-6">
            <Image
                src="https://firebasestorage.googleapis.com/v0/b/yieldme-39169.appspot.com/o/app%2Fimages%2Fpromise-logo.png?alt=media&token=b5d1d5aa-83c6-4b51-aa5b-e919ac3adcd1"
                alt="Picture of the author"
                width={100}
                height={100}
            />
            <h1 className="py-4 px-4 font-blog text-5xl text-slate-200"></h1>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-lg lg:flex-grow">
                    <Link href="/">
                        <a className="block mt-4 lg:inline-block lg:mt-0 text-slate-200 bg-slate-800 hover:text-white mr-4 rounded px-5 py-2 hover:bg-blue-700">
                            Home
                        </a>
                    </Link>
                    <Link href="/form">
                        <a className="block mt-4 lg:inline-block lg:mt-0 text-slate-200 bg-slate-800 hover:text-white mr-4 rounded px-5 py-2 hover:bg-blue-700">
                            Create New Fund
                        </a>
                    </Link>
                    <CategorySelector></CategorySelector>
                </div>
            </div>

            <div className="ml-auto py-2 px-2">
                <ConnectButton moralisAuth={true} />
            </div>
        </nav>
    )
}
