import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import type { AppProps } from "next/app"
import { BrowserRouter as Router, Routes, Route }
    from 'react-router-dom';
import Home from './index';
import Form from './form';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || ""
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || ""

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Component {...pageProps} />
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp
