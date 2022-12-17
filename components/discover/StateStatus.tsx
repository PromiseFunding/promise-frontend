import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import styles from "../../styles/Home.module.css"
import { styled } from '@mui/material/styles';
import { useMoralis, useWeb3Contract } from "react-moralis"
import { milestone, propType, milestoneSummary, propTypeFundCard } from '../../config/types';
import { useState, useEffect } from 'react';
import { abi } from "../../constants"
import { BigNumber } from "ethers"
import { tokenConfig } from "../../config/token-config"
import { ref, get } from "firebase/database"
import { database } from "../../firebase-config"
import { states } from "../../config/helper-config"

export default function StateStatus(props: propTypeFundCard) {
    const fundAddress = props.fund

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainIdNum = parseInt(chainIdHex!)
    const chainId: string = parseInt(chainIdHex!).toString()
    const [percent, setPercent] = useState(0)
    const [tranche, setTranche] = useState(0)
    const [state, setState] = useState(0)
    const [amountRaisedMilestone, setAmountRaisedMilestone] = useState(0)
    const [amountRaisedTotal, setAmountRaisedTotal] = useState(0)
    const [amountRaisedPre, setAmountRaisedPre] = useState(0)
    const [asset, setAsset] = useState("")
    const [milestoneName, setMilestoneName] = useState("")

    const getMilestoneName = async () => {
        const milestonesRef = ref(database, chainId + "/funds/" + fundAddress + "/milestones/" + tranche + "/name")
        const snapshot = await get(milestonesRef)
        setMilestoneName(snapshot.val())
    }

    const {
        runContractFunction: getMilestoneSummary,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getMilestoneSummary",
        params: {},
    })

    const {
        runContractFunction: getTimeLeftRound,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getTimeLeftRound",
        params: {},
    })

    async function updateUI() {
        const milestoneInfo = await getMilestoneSummary() as milestoneSummary
        const tranchesFromCall = milestoneInfo.milestones
        const currentTrancheFromCall = milestoneInfo.currentTranche
        setTranche(currentTrancheFromCall!)
        const currentStateFromCall = milestoneInfo.state
        setState(currentStateFromCall!)
        await getMilestoneName()
        const timeLeftFromCall = milestoneInfo.timeLeftRound
        if (currentStateFromCall == 4) {
            const roundDuration = milestoneInfo.preDuration
            const percent = (roundDuration!.toNumber() - timeLeftFromCall.toNumber()) / roundDuration!.toNumber() * 100
            setPercent(percent)
        } else {
            const roundDuration = tranchesFromCall[currentTrancheFromCall].milestoneDuration
            const percent = (roundDuration!.toNumber() - timeLeftFromCall.toNumber()) / roundDuration!.toNumber() * 100
            setPercent(percent)
        }
        const amountRaisedFromCall = tranchesFromCall[currentTrancheFromCall].totalRaised
        const amountRaisedTotalFromCall = milestoneInfo.lifeTimeRaised
        const amountRaisedPreFromCall = milestoneInfo.preTotalFunds
        const assetAddressFromCall = milestoneInfo.assetAddress
        const coinName = getAssetName(assetAddressFromCall!)
        setAsset(coinName)
        setAmountRaisedMilestone(+(amountRaisedFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        setAmountRaisedTotal(+(amountRaisedTotalFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        props.onChangeAmount!(+(amountRaisedTotalFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
        setAmountRaisedPre(+(amountRaisedPreFromCall!.toNumber() / 10 ** tokenConfig[chainIdNum][coinName].decimals!).toFixed(2))
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
            {state == 4 ? (
                <>Seed Funding Round
                    <BorderLinearProgress variant="determinate" value={percent} />
                    {amountRaisedPre} {asset} Raised
                </>)
                :
                (<>Milestone {tranche + 1}: <b>{milestoneName}</b>
                    <BorderLinearProgress variant="determinate" value={percent} />
                    {amountRaisedTotal} {asset} Raised
                    <br></br>
                </>)}
        </div>
    )
}
