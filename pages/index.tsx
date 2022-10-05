import type { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import * as React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { CardActionArea } from "@mui/material"

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>YieldMe Version 1.0</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <Header></Header>
            <br></br>
            <div>
            <h1 className="font-blog text-4xl text-slate-200">Discover Fundraisers</h1>
            </div>
            <br></br>
            <br></br>
            <Card sx={{ maxWidth: 345, minHeight: 250 }}>
                <CardActionArea href="/details">
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            First Fundraiser
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Proof of Concept for Donating to projects you believe in. Our project is YieldMe!
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    )
}

export default Home
