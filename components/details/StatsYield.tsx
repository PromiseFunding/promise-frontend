import React, { useEffect, useState } from "react"
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"
import { Pie, Bar } from "react-chartjs-2"
import { funderSummaryYield, fundSummary, propType } from "../../config/types"
import { updateMetadata } from "firebase/storage"
import { useMoralis } from "react-moralis"
import { height } from "@mui/system"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

type dataType = {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        backgroundColor: string[]
        borderColor: string[]
        borderWidth: number
        rotation: number
    }[]
}

export default function StatsYield(props: propType) {
    const fundSummary = props.fundSummary as fundSummary
    const funderSummaryYield = props.funderSummaryYield as funderSummaryYield
    const decimals = props.decimals!
    const owner = fundSummary.owner!
    const coinName = props.coinName

    const { account } = useMoralis()

    const [userAddress, setUserAddress] = useState("")

    useEffect(() => {
        if (account) {
            setUserAddress(account)
        }
    }, [account])

    const getData = () => {
        const newData = {
            labels: ["Life Time Funded", "Total Straight Donated", "Amount Withdrawn"],
            datasets: [
                {
                    label: `Total Amount Raised (${coinName})`,
                    data: [1, 1, 1],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                    ],
                    borderWidth: 1,
                    rotation: -90,
                },
            ],
        }

        newData.datasets[0].data.unshift(
            fundSummary.totalWithdrawnByOwner.toNumber() / 10 ** decimals
        )
        newData.datasets[0].data.unshift(
            fundSummary.totalLifetimeStraightFunded.toNumber() / 10 ** decimals
        )
        newData.datasets[0].data.unshift(
            fundSummary.totalLifetimeFunded.toNumber() / 10 ** decimals
        )

        newData.datasets[0].backgroundColor = newData.datasets[0].backgroundColor.slice(0, 3)
        newData.datasets[0].borderColor = newData.datasets[0].borderColor.slice(0, 3)
        newData.labels = newData.labels.slice(0, 3)

        return newData
    }

    const getDataFunder = () => {
        const newData = {
            labels: ["Life Time Contributed", "Total Straight Donated", "Amount Withdrawable"],
            datasets: [
                {
                    label: `Total Amount Raised (${coinName})`,
                    data: [1, 1, 1],
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                    ],
                    borderWidth: 1,
                    rotation: -90,
                },
            ],
        }

        newData.datasets[0].data.unshift(
            funderSummaryYield.amountWithdrawable.toNumber() / 10 ** decimals
        )
        newData.datasets[0].data.unshift(
            funderSummaryYield.amountTotal.toNumber() / 10 ** decimals
        )
        newData.datasets[0].data.unshift(
            funderSummaryYield.amountTotal.toNumber() / 10 ** decimals
        )

        newData.datasets[0].backgroundColor = newData.datasets[0].backgroundColor.slice(0, 3)
        newData.datasets[0].borderColor = newData.datasets[0].borderColor.slice(0, 3)
        newData.labels = newData.labels.slice(0, 3)

        return newData
    }

    const getOptions = (type: string) => {
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom" as const,
                    display: false,
                },
                title: {
                    display: true,
                    fontSize: 30,
                    text:
                        type == "owner"
                            ? `Fund Stats (${coinName})`
                            : `Your Contributions (${coinName})`,
                },
            },
        }

        return options
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <h1
                style={{
                    fontSize: "40px",
                    fontWeight: "500",
                    textAlign: "center",
                    padding: "30px",
                }}
            >
                Fund Statistics
            </h1>
            {fundSummary.totalLifetimeFunded.toNumber() > 0 ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: "20px",
                        justifyContent: "center",
                    }}
                >
                    <div style={{ width: "65%" }}>
                        <Bar options={getOptions("owner")} data={getData()} />
                        <br></br>
                        {userAddress != owner!.toLowerCase() ? (
                            <Bar options={getOptions("funder")} data={getDataFunder()} />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            ) : (
                <h1 style={{ fontSize: "20px", textAlign: "center" }}>
                    This fundraiser has no statistics to report yet.{" "}
                </h1>
            )}
        </div>
    )
}
