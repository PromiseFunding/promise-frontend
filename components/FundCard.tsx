import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { CardActionArea } from "@mui/material"
import { ref, onValue } from "firebase/database"
import { database } from "../firebase-config"
import { databaseFundObject } from "../config/types"
import styles from "../styles/Home.module.css"
import StateStatus from "./discover/StateStatus"
import { useMoralis, useWeb3Contract } from "react-moralis"


export default function FundCard(props: { fund: string }) {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()
    const fund = props.fund
    const fundRef = ref(database, chainId + "/funds/" + fund)

    const [data, setData] = useState<databaseFundObject>()
    useEffect(() => {
        onValue(fundRef, (snapshot) => {
            setData(snapshot.val())
        })
    }, [])

    return (
        <div>
            {data ? (
                <div className="main text-center">
                    <Card
                        sx={{ maxWidth: 345, height: 370, backgroundColor: "Gainsboro", width: 250, position: "relative" }}
                        color="gray"
                    >
                        <CardActionArea href={`/details/?fund=${fund}`} sx={{
                            display: "flex", flexDirection: "column", height: "100%"
                        }}>
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
                                <div style={{
                                    fontSize: "20px", fontWeight: "700", margin: "5px", display: "-webkit-box",
                                    overflow: "hidden",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                }}>{data.fundTitle}</div>
                                <div style={{
                                    display: "-webkit-box",
                                    overflow: "hidden",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 3,
                                    fontSize: "12px",
                                    marginLeft: "5px",
                                    marginRight: "5px"
                                }}>{data.description}</div>
                            </div>

                            <StateStatus fundAddress={fund!}></StateStatus>
                        </CardActionArea>
                    </Card>
                </div>
            ) : (
                <div></div>
            )
            }
        </div >
    )
}
