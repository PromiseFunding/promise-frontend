import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import type { AppProps } from "next/app"
import { useCallback } from "react"
import { connectStorageEmulator } from "firebase/storage"
import { Poppins } from '@next/font/google'
const { library, config } = require('@fortawesome/fontawesome-svg-core');
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCoffee, fas } from '@fortawesome/free-solid-svg-icons'
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import React from 'react';
import createEmotionCache from '../src/createEmotionCache';
import { CacheProvider } from '@emotion/react';


library.add(fab, faCoffee, fas)

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || ""
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || ""

const clientSideEmotionCache = createEmotionCache();

const poppins = Poppins({
    weight: ['400', '500', '700'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
})

function MyApp({ Component, pageProps }: AppProps) {
    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles);
        }
    }, []);

    return (
        <CacheProvider value={clientSideEmotionCache}>
            <main className={poppins.className}>
                <CssBaseline />

                <MoralisProvider initializeOnMount={false}>
                    <NotificationProvider>
                        <ThemeProvider theme={theme}>
                            <Component {...pageProps} />
                        </ThemeProvider>
                    </NotificationProvider>
                </MoralisProvider>
            </main>
        </CacheProvider>
    )
}

export default MyApp
