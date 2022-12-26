import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import Tutorial from "../components/Tutorial"
import Particles from "react-tsparticles"
import { loadFull } from "tsparticles"
import { useCallback } from "react"
import { Engine } from "tsparticles-engine"

const Info: NextPage = () => {
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
        <div>
            <Particles options={options} init={particlesInit} style={{ zIndex: -1 }} />
            <Head>
                <title>Promise</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <Header main={false}></Header>
            <Tutorial></Tutorial>

        </div>
    )
}

export default Info
