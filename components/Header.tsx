import { ConnectButton } from "web3uikit"
import Image from "next/image"

export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <Image
                src="/../public/yieldmeicon3.png"
                alt="Picture of the author"
                width={100}
                height={100}
            />
            <h1 className="py-4 px-4 font-blog text-5xl">YieldMe</h1>
            <div className="ml-auto py-2 px-2">
                <ConnectButton moralisAuth={true} />
            </div>
        </div>
    )
}
