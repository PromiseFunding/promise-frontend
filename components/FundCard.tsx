import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { CardActionArea } from "@mui/material"
import { ref, onValue } from "firebase/database"
import { database } from "../firebase-config"
import { databaseFundObject } from "../config/types"

export default function FundCard(props: { fund: string }) {
    const fund = props.fund
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
                        sx={{ maxWidth: 345, height: 470, backgroundColor: "Gainsboro" }}
                        color="gray"
                    >
                        <CardActionArea href={`/details/?fund=${fund}`}>
                            <CardMedia
                                component="img"
                                height="140"
                                width="140"
                                image={data.imageURL}
                                alt="fundraiser"
                                sx={{
                                    width: 340,
                                    height: 340,
                                }}
                            />
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    noWrap={true}
                                    color="black"
                                >
                                    <b>{data.fundTitle}</b>
                                </Typography>
                                <Typography
                                    sx={{
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 3,
                                    }}
                                    variant="body2"
                                    color="black"
                                >
                                    {data.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}
