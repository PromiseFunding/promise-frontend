import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { SetStateAction, useEffect, useState } from "react"
import { CardActionArea } from "@mui/material"
import { ref, onValue } from "firebase/database"
import { database } from "../firebase-config"
import { databaseFundObject } from "../config/types"
import styles from "../styles/Home.module.css"
import StateStatus from "./discover/StateStatus"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { propTypeFundCard } from "../config/types"
import Tooltip from "@mui/material/Tooltip"
import Link from "next/link"
import StateStatusYield from "./discover/StateStatusYield"

export default function FundCard(props: propTypeFundCard) {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()
    const fund = props.fund
    const fundRef = ref(database, chainId + "/funds/" + fund)

    const typeFundRef = ref(database, chainId + "/funds/" + fund + "/type")

    // const [amountPerFund, setAmountPerFund] = useState(0)
    const [data, setData] = useState<databaseFundObject>()
    const [typeFund, setTypeFund] = useState("")

    useEffect(() => {
        onValue(fundRef, (snapshot) => {
            setData(snapshot.val())
        })
    }, [])

    useEffect(() => {
        onValue(typeFundRef, (snapshot) => {
            setTypeFund(snapshot.val())
        })
    }, [])

    // function handleScroll(section: string) {
    //     const element = document.getElementById(section)
    //     element!.scrollIntoView({ behavior: "smooth", inline: "nearest" })
    // }

    return (
        <div>
            {data ? (
                typeFund == "Yield Fund" ? (
                    <div>
                        <div className="main text-center">
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    height: 370,
                                    backgroundColor: "Gainsboro",
                                    width: 250,
                                    position: "relative",
                                }}
                                color="gray"
                            >
                                <CardActionArea
                                    // href={`/details/?fund=${fund}`} eventually change to the details page
                                    href={`/discover`}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                    }}
                                >
                                    <Tooltip
                                        title={
                                            <>
                                                Yield Fund: This fundraiser uses Promises unique
                                                interest based fundraising functionality.{" "}
                                                <Link
                                                    href="/info"
                                                    style={{
                                                        textDecoration: "underline",
                                                        color: "lightblue",
                                                    }}
                                                    // onClick={(e) => {
                                                    //     window.onload = () => {
                                                    //         handleScroll("faq")
                                                    //     }
                                                    // }}
                                                >
                                                    Learn more
                                                </Link>
                                            </>
                                        }
                                        placement="top"
                                        arrow
                                    >
                                        <div className={styles.yellowBadge}>Y</div>
                                    </Tooltip>{" "}
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        width="100"
                                        image={data.imageURL}
                                        alt="fundraiser"
                                        sx={{
                                            width: 250,
                                            height: 185,
                                        }}
                                    />
                                    <div style={{ height: "90px" }}>
                                        <div
                                            style={{
                                                fontSize: "20px",
                                                fontWeight: "700",
                                                margin: "5px",
                                                display: "-webkit-box",
                                                overflow: "hidden",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: 2,
                                            }}
                                        >
                                            {data.fundTitle}
                                        </div>
                                        <div
                                            style={{
                                                display: "-webkit-box",
                                                overflow: "hidden",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: 3,
                                                fontSize: "12px",
                                                marginLeft: "5px",
                                                marginRight: "5px",
                                            }}
                                        >
                                            {data.description}
                                        </div>
                                    </div>
                                    <StateStatusYield
                                        fundAddress={fund!}
                                        format="discover"
                                    ></StateStatusYield>
                                </CardActionArea>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="main text-center">
                            <Card
                                sx={{
                                    maxWidth: 345,
                                    height: 370,
                                    backgroundColor: "Gainsboro",
                                    width: 250,
                                    position: "relative",
                                }}
                                color="gray"
                            >
                                <CardActionArea
                                    href={`/details/?fund=${fund}`}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "100%",
                                    }}
                                >
                                    <Tooltip
                                        title={
                                            <>
                                                Promise Fund: This fundraiser uses Promises unique
                                                milestone based fundraising functionality.{" "}
                                                <Link
                                                    href="/info"
                                                    style={{
                                                        textDecoration: "underline",
                                                        color: "lightblue",
                                                    }}
                                                    // onClick={(e) => {
                                                    //     window.onload = () => {
                                                    //         handleScroll("faq")
                                                    //     }
                                                    // }}
                                                >
                                                    Learn more
                                                </Link>
                                            </>
                                        }
                                        placement="top"
                                        arrow
                                    >
                                        <div className={styles.purpleBadge}>P</div>
                                    </Tooltip>{" "}
                                    <CardMedia
                                        component="img"
                                        height="100"
                                        width="100"
                                        image={data.imageURL}
                                        alt="fundraiser"
                                        sx={{
                                            width: 250,
                                            height: 185,
                                        }}
                                    />
                                    <div style={{ height: "90px" }}>
                                        <div
                                            style={{
                                                fontSize: "20px",
                                                fontWeight: "700",
                                                margin: "5px",
                                                display: "-webkit-box",
                                                overflow: "hidden",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: 2,
                                            }}
                                        >
                                            {data.fundTitle}
                                        </div>
                                        <div
                                            style={{
                                                display: "-webkit-box",
                                                overflow: "hidden",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: 3,
                                                fontSize: "12px",
                                                marginLeft: "5px",
                                                marginRight: "5px",
                                            }}
                                        >
                                            {data.description}
                                        </div>
                                    </div>
                                    <StateStatus
                                        fundAddress={fund!}
                                        format="discover"
                                    ></StateStatus>
                                </CardActionArea>
                            </Card>
                        </div>
                    </div>
                )
            ) : (
                <div></div>
            )}
        </div>
    )
}
