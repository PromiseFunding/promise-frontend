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

export default function FundCard(props: { fund: string, fundWidth: number }) {
    const fund = props.fund
    const fundWidth = props.fundWidth
    const fundRef = ref(database, "funds/" + fund)

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
                        sx={{ maxWidth: 345, height: 350, backgroundColor: "Gainsboro", width: fundWidth, position: "relative" }}
                        color="gray"
                    >
                        <CardActionArea href={`/details/?fund=${fund}`} sx={{ display: "flex", flexDirection: "column" }}>
                            <CardMedia
                                component="img"
                                height="100"
                                width="100"
                                image={data.imageURL}
                                alt="fundraiser"
                                sx={{
                                    width: fundWidth,
                                    height: 175,
                                }}
                            />
                            <div style={{ height: "90px" }}>
                                <div style={{ fontSize: "20px", fontWeight: "700", margin: "5px" }}>{data.fundTitle}</div>
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
