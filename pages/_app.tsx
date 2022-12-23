import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import type { AppProps } from "next/app"
import { Poppins } from "@next/font/google"
const { library, config } = require("@fortawesome/fontawesome-svg-core")
import { fab } from "@fortawesome/free-brands-svg-icons"
import { faCoffee, fas } from "@fortawesome/free-solid-svg-icons"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import { useCallback } from "react"
import { Engine } from "tsparticles-engine"
import { connectStorageEmulator } from "firebase/storage"

library.add(fab, faCoffee, fas)

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || ""
const APP_ID = process.env.NEXT_PUBLIC_APP_ID || ""

const poppins = Poppins({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
})

function MyApp({ Component, pageProps }: AppProps) {
    let page = ""
    if (typeof window !== "undefined") {
        page = window.location.pathname
    }
    console.log(page)
    const options = {
        // background: {
        //     color: "#fff",
        // },
        particles: {
            shape: {
                type: "circle",
            },
            number: {
                value: 7,
            },
            color: {
                // value: "random",
                //value: ["#0A1A6A", "#A42525"]
                value: "#A42525",
            },
            opacity: {
                value: 0.3,
            },
            size: {
                value: { min: 15, max: 30 },
            },
            move: {
                enable: true,
                speed: 0.25,
                random: false,
            },
            bounds: {
                top: 500,
            },
        },
    }

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine)
    }, [])

    return (
        <main className={poppins.className}>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    {!(page.includes("form") || page.includes("details")) ? (
                        <Particles options={options} init={particlesInit} style={{ zIndex: -1 }} />
                    ) : null}
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </main>
    )
}

export default MyApp
