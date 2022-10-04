import { ConnectButton } from "web3uikit"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
    return (
        <nav className=" border-b-2 flex items-center justify-between flex-wrap p-6">
            <Image
                src="/../public/yieldmeicon3.png"
                alt="Picture of the author"
                width={100}
                height={100}
            />
            <h1 className="py-4 px-4 font-blog text-5xl text-slate-200">YieldMe</h1>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-lg lg:flex-grow">
                    <Link href="/">
                        <a className="block mt-4 lg:inline-block lg:mt-0 text-slate-200 bg-slate-800 hover:text-white mr-4 rounded px-5 py-2">
                            Home
                        </a>
                    </Link>
                    <Link href="/form">
                        <a className="block mt-4 lg:inline-block lg:mt-0 text-slate-200 bg-slate-800 hover:text-white mr-4 rounded px-5 py-2">
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
