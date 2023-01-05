import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { funderSummary, milestoneSummary, propType } from '../../config/types';
import { updateMetadata } from 'firebase/storage';
import { useMoralis } from 'react-moralis';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

type dataType = {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        backgroundColor: string[]
        borderColor: string[]
        borderWidth: number
        rotation: number
    }[];
}


export default function Stats(props: propType) {
    const milestoneSummary = props.milestoneSummary as milestoneSummary
    const funderSummary = props.funderSummary as funderSummary
    const decimals = props.decimals!
    const owner = milestoneSummary.owner
    const coinName = props.coinName

    const { account } = useMoralis()

    const [userAddress, setUserAddress] = useState("")

    useEffect(() => {
        if (account) {
            setUserAddress(account)
        }
    }, [account])

    const getData = (type: string) => {
        const newData = {
            labels: ['Seed Funding Round', 'Milestone 1', 'Milestone 2', 'Milestone 3', 'Milestone 4', 'Milestone 5'],
            datasets: [
                {
                    label: `Total Amount Raised (${coinName})`,
                    data: [1, 1, 1, 1, 1, 1],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                    rotation: -90
                },
            ],
        }
        const milestones = milestoneSummary.milestones
        if (type == "funder") {
            newData.datasets[0].data = funderSummary.amounts.map(a => a.toNumber() / 10 ** decimals)
            newData.datasets[0].data.unshift(funderSummary.seedFundAmount.toNumber() / 10 ** decimals)

        } else {
            newData.datasets[0].data = milestones.map(a => a.totalRaised!.toNumber() / 10 ** decimals)
            newData.datasets[0].data.unshift(milestoneSummary.preMilestoneTotalFunded.toNumber() / 10 ** decimals)
        }

        newData.datasets[0].backgroundColor = newData.datasets[0].backgroundColor.slice(0, milestones.length + 1)
        newData.datasets[0].borderColor = newData.datasets[0].borderColor.slice(0, milestones.length + 1)
        newData.labels = newData.labels.slice(0, milestones.length + 1)

        return newData
    }

    const getOptions = (type: string) => {
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom' as const,
                    display: false
                },
                title: {
                    display: true,
                    fontSize: 30,
                    text: type == "owner" ? `Total Raised by Milestone (${coinName})` : `Your Contributions By Milestone (${coinName})`,
                },
            },
        };

        return options
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <h1 style={{ fontSize: "40px", fontWeight: "500", textAlign: "center", padding: "30px" }}>Milestone Statistics</h1>
            <div style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
                <div style={{ width: "50%" }}>
                    <Bar options={getOptions("owner")} data={getData("owner")} />
                    {userAddress != owner.toLowerCase() ? (
                        <Bar options={getOptions("funder")} data={getData("funder")} />
                    ) : (<></>)}
                </div>
                <div style={{ width: "50%" }}>
                    <Pie data={getData("owner")} title="Total Raised by Milestone" />
                </div>
            </div>
        </div>
    )
}


