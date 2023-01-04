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

const defaultData = {
    labels: ['Seed Funding Round', 'Milestone 1', 'Milestone 2', 'Milestone 3', 'Milestone 4', 'Milestone 5'],
    datasets: [
        {
            label: 'Total Amount Raised (USDT)',
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

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Chart.js Bar Chart',
        },
    },
};


export default function Stats(props: propType) {
    const milestoneSummary = props.milestoneSummary as milestoneSummary
    const funderSummary = props.funderSummary as funderSummary
    const decimals = props.decimals!
    const owner = milestoneSummary.owner

    const { account } = useMoralis()

    const [data, setData] = useState(defaultData)
    const [funderData, setFunderData] = useState(defaultData)
    const [userAddress, setUserAddress] = useState("")

    useEffect(() => {
        updateData(milestoneSummary)
    }, [milestoneSummary])

    useEffect(() => {
        if (account) {
            setUserAddress(account)
        }
    }, [account])

    const updateData = (milestoneSummary: milestoneSummary) => {
        const newData = defaultData
        const milestones = milestoneSummary.milestones
        newData.datasets[0].data = milestones.map(a => a.totalRaised!.toNumber() / 10 ** decimals)
        newData.datasets[0].data.unshift(milestoneSummary.preMilestoneTotalFunded.toNumber() / 10 ** decimals)
        console.log(newData.datasets[0].data)
        newData.datasets[0].backgroundColor = newData.datasets[0].backgroundColor.slice(0, milestones.length + 1)
        newData.datasets[0].borderColor = newData.datasets[0].borderColor.slice(0, milestones.length + 1)
        newData.labels = newData.labels.slice(0, milestones.length + 1)

        setData(newData)
    }

    return (
        <div style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}>
            <div style={{ width: "50%" }}>
                <Bar options={options} data={data} />
                {userAddress != owner.toLowerCase() ? (
                    <Bar options={options} data={funderData} />
                ) : (<></>)}
            </div>
            <div style={{ width: "50%" }}>
                <Pie data={data} />
            </div>
        </div>
    )
}


