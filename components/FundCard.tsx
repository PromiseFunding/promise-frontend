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
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
    purpleBadge: {
        position: "absolute",
        top: 6,
        left: 6,
        backgroundColor: "#9C27B0",
        color: "#FFFFFF",
        width: 30,
        height: 30,
        //borderRadius: "50%", //circular option
        borderRadius: "4px 4px 4px 4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1 rem",
    },
})

export default function FundCard(props: propTypeFundCard) {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()
    const fund = props.fund
    const fundRef = ref(database, chainId + "/funds/" + fund)

    // const [amountPerFund, setAmountPerFund] = useState(0)
    const [data, setData] = useState<databaseFundObject>()

    // useEffect(() => {
    //     props.onChangeAmount!(amountPerFund!)
    // }, [amountPerFund])

    useEffect(() => {
        onValue(fundRef, (snapshot) => {
            setData(snapshot.val())
        })
    }, [])

    const classes = useStyles()

    return (
        <div>
            {data ? (
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
                                <div className={classes.purpleBadge}>P</div>
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

                                {/* <StateStatus fund={fund!} onChangeAmount={(newAmount: SetStateAction<Number>) =>
                            setAmountPerFund(Number(newAmount))
                        }></StateStatus> */}
                                <StateStatus fund={fund!}></StateStatus>
                            </CardActionArea>
                        </Card>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}
