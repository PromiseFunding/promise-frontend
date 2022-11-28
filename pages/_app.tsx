import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import type { AppProps } from "next/app"
import { Poppins } from '@next/font/google'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || ""
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || ""

const poppins = Poppins({
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <main className={poppins.className}>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </main>
    )
}

export default MyApp
