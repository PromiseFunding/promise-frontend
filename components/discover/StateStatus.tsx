import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import styles from "../../styles/Home.module.css"
import { styled } from '@mui/material/styles';
import { useMoralis, useWeb3Contract } from "react-moralis"
import { milestone, propType } from '../../config/types';
import { useState, useEffect } from 'react';
import { abi } from "../../constants"
import { BigNumber } from "ethers"
import { tokenConfig } from "../../config/token-config"
import { ref, get } from "firebase/database"
import { database } from "../../firebase-config"

export default function StateStatus(props: propType) {
    const fundAddress = props.fundAddress

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainIdNum = parseInt(chainIdHex!)

    const [percent, setPercent] = useState(0)
    const [tranche, setTranche] = useState(0)
    const [amountRaised, setAmountRaised] = useState(0)
    const [asset, setAsset] = useState("")
    const [milestoneName, setMilestoneName] = useState("")

    const getMilestoneName = async () => {
        const milestonesRef = ref(database, "funds/" + fundAddress + "/milestones/" + tranche + "/name")
        const snapshot = await get(milestonesRef)
        setMilestoneName(snapshot.val())
    }

    const {
        runContractFunction: getTranches,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getTranches",
        params: {},
    })

    const {
        runContractFunction: getCurrentTranche,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getCurrentTranche",
        params: {},
    })

    const {
        runContractFunction: getTimeLeftMilestone,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getTimeLeftMilestone",
        params: {},
    })

    const {
        runContractFunction: getTrancheAmountRaised,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getTrancheAmountRaised",
        params: { level: tranche },
    })

    const {
        runContractFunction: getAssetAddress,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getAssetAddress",
        params: {},
    })

    async function updateUI() {
        const tranchesFromCall = await getTranches() as milestone[]
        const currentTrancheFromCall = await getCurrentTranche() as number
        setTranche(currentTrancheFromCall)
        await getMilestoneName()
        const timeLeftFromCall = await getTimeLeftMilestone() as BigNumber
        const milestoneDuration = tranchesFromCall[currentTrancheFromCall].milestoneDuration
        const percent = (milestoneDuration!.toNumber() - timeLeftFromCall.toNumber()) / milestoneDuration!.toNumber() * 100
        const amountRaisedFromCall = await getTrancheAmountRaised() as BigNumber
        const assetAddressFromCall = await getAssetAddress() as string
        const coinName = getAssetName(assetAddressFromCall)
        setAsset(coinName)
        setAmountRaised(+(amountRaisedFromCall.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        setPercent(percent)
    }

    const getAssetName = (address: string) => {
        for (const coin in tokenConfig[chainIdNum]) {
            if (tokenConfig[chainIdNum][coin].assetAddress == address) {
                return coin
            }
        }
        return ""
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundAddress])

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? 'green' : 'green',
        },
    }));

    return (
        <div className={styles.stateStatus}>
            Milestone {tranche + 1}: <b>{milestoneName}</b>
            <BorderLinearProgress variant="determinate" value={percent} />
            {amountRaised} {asset} raised
        </div>
    )
}
