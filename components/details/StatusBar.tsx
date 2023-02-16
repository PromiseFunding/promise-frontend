import { useEffect, useState, Fragment } from "react"
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { propType, milestone, funderSummary } from "../../config/types"
import { ref, get } from "firebase/database"
import { database } from "../../firebase-config"
import styles from "../../styles/details/details.module.css"
import NewMilestone from "./NewMilestone"
import StateStatus from "../discover/StateStatus";
import { abi } from "../../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { formatDuration, convertSeconds } from '../../utils/utils';
import { DEFAULT_CHAIN_ID } from "../../config/helper-config"

const steps = ['Milestone 1', 'Milestone 2', 'Milestone 3', 'Milestone 4', 'Milestone 5'];

export default function HorizontalNonLinearStepper(props: propType) {
    const fundAddress = props.fundAddress
    const tranche = props.tranche
    const milestoneDurations = props.milestoneDurations
    const decimals = props.decimals
    const coinName = props.coinName
    const userAddress = props.userAddress
    const currState = props.currState
    const owner = props.ownerFund
    const milestoneSummary = props.milestoneSummary
    const funderSummary = props.funderSummary

    const [activeStep, setActiveStep] = useState(tranche! + 1);
    const [milestonesArray, setMilestonesArray] = useState<milestone[]>([])
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const [withdrewFunds, setFunderWithdraw] = useState(false)
    const [amountRaisedPre, setAmountPreRaised] = useState(0)
    const [durationPreRound, setDurationPre] = useState(0)
    const [percent, setPercent] = useState(0)
    const [preFundingEnd, setPreFundingEnd] = useState(0)
    const [totalRaised, setTotalRaised] = useState(0)
    const [roundEnd, setRoundEnd] = useState(0)

    const chainId: string = chainIdHex ? parseInt(chainIdHex!).toString() : DEFAULT_CHAIN_ID


    const { runContractFunction: getFunderSummary } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getFunderSummary",
        params: { funder: account, level: activeStep > 0 ? activeStep - 1 : 6 },
    })

    const getMilestones = async () => {
        const milestonesRef = ref(database, chainId + "/funds/" + fundAddress + "/milestones")
        const snapshot = await get(milestonesRef)
        setMilestonesArray(snapshot.val())
    }

    async function updateUI() {
        const funderSummary = await getFunderSummary() as funderSummary
        const amountFundedFromCall = funderSummary!.funderTrancheAmountRaised.toNumber()
        const amountRaisedFromCall = funderSummary!.trancheAmountRaised.toNumber()
        const amountTotalRaisedFromCall = funderSummary!.trancheTotalAmountRaised.toNumber()
        const amountTotalPreRaisedFromCall = milestoneSummary!.preMilestoneTotalFunded.toNumber()
        const getDurationPreRound = milestoneSummary!.preFundingDuration.toNumber()
        const didFunderWithdrawFromCall = funderSummary!.didFunderWithdraw
        const tranchesFromCall = milestoneSummary!.milestones
        const timeLeftFromCall = milestoneSummary!.timeLeftRound

        setAmountPreRaised(amountTotalPreRaisedFromCall / 10 ** decimals!)
        setDurationPre(getDurationPreRound)
        setFunderWithdraw(didFunderWithdrawFromCall)
        setPreFundingEnd(milestoneSummary!.preFundingEnd.toNumber())
        setTotalRaised(milestoneSummary!.lifeTimeRaised.toNumber() / 10 ** decimals!)

        if (currState == 4) {
            const roundDuration = milestoneSummary!.preFundingDuration
            const percent = (roundDuration!.toNumber() - timeLeftFromCall.toNumber()) / roundDuration!.toNumber() * 100
            setPercent(percent)
        } else {
            const roundDuration = tranchesFromCall[tranche!].milestoneDuration
            const percent = (roundDuration!.toNumber() - timeLeftFromCall.toNumber()) / roundDuration!.toNumber() * 100
            setPercent(percent)
        }
    }

    useEffect(() => {
        getMilestones()

        if (isWeb3Enabled && fundAddress && milestoneSummary) {
            updateUI()
        }
    }, [activeStep, userAddress, totalRaised, milestoneSummary, fundAddress])

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        marginLeft: "50px",
        marginRight: "50px",
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? 'green' : 'green',
        },
    }));

    return (
        <div className={styles.milestoneSelector}>
            {
                milestonesArray && milestonesArray.length > 0 && milestoneDurations ? (
                    <div>
                        <div className="pb-20">
                            <h1 style={{ fontSize: "40px", fontWeight: "500", textAlign: "center", paddingTop: "30px" }}>Fundraiser Overview</h1>
                            <p className="text-center text-slate-900 pt-2"> Select a round to see the Promises made for that milestone.</p>
                        </div>

                        <Box sx={{ width: '100%', justifyContent: "center", }} >
                            <Stepper nonLinear activeStep={activeStep}>
                                <Step key={0} sx={{
                                    '& .MuiStepLabel-root .Mui-completed': {
                                        color: 'green', // circle color (ACTIVE)
                                    },
                                }} completed={currState != 4}>
                                    <StepButton color="inherit" onClick={handleStep(0)}>
                                        {"Seed Funding Round"}
                                    </StepButton>
                                </Step>
                                {milestonesArray.map((milestone, index) => (
                                    <Step key={index} sx={{
                                        '& .MuiStepLabel-root .Mui-completed': {
                                            color: 'green', // circle color (ACTIVE)
                                        },
                                    }} completed={index < tranche!}>
                                        <StepButton color="inherit" onClick={handleStep(index + 1)}>
                                            {milestone.name}
                                        </StepButton>
                                    </Step>
                                ))}
                            </Stepper>
                            <div>
                                {milestoneDurations.length < 5 && userAddress == owner && currState != 3 && currState != 1 ? (
                                    <div>
                                        <NewMilestone fundAddress={fundAddress} onChangeState={() => {
                                            props.onChangeState!()
                                        }} />
                                    </div>) : (
                                    <></>
                                )}
                            </div>
                            <br></br>
                            <br></br>
                            <div>
                                {activeStep > 0 ? (
                                    <div>
                                        <Fragment>
                                            <h1 className={styles.milestoneTitle}>Milestone {activeStep} -  {milestonesArray[activeStep - 1].name}</h1>
                                            <div style={{ display: "flex", flexDirection: "row", marginTop: "50px" }}>
                                                <p className={styles.textarea}>{milestonesArray[activeStep - 1].description}</p>
                                                <div style={{ width: "50%", textAlign: "center" }}>
                                                    {currState == 4 ? (<h1 style={{ fontSize: "30px" }}>This milestone hasn&apos;t started taking donations yet.</h1>) :
                                                        <div>
                                                            <div style={{ fontSize: "40px" }}> <b style={{ color: "green", fontWeight: "400" }}>{(milestoneSummary!.milestones[activeStep - 1]!.totalRaised!.toNumber() / 10 ** decimals!).toLocaleString("en-US")}</b> {coinName}</div>
                                                            <h1 style={{ fontSize: "15px" }}>raised in <b>{milestonesArray[activeStep - 1].name}</b> of <b style={{ color: "green" }}>{totalRaised.toLocaleString("en-US")}</b> {coinName} total.</h1>

                                                            {tranche == activeStep - 1 ? (
                                                                <div >
                                                                    <BorderLinearProgress variant="determinate" value={percent} />
                                                                    <h2>Round ends {convertSeconds(milestoneSummary!.milestones![activeStep - 1]!.startTime!.toNumber() + milestoneSummary!.milestones![activeStep - 1]!.milestoneDuration!.toNumber())}</h2>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    {tranche! < activeStep - 1 ?
                                                                        (<></>) :
                                                                        (<h2>Round ended {convertSeconds(preFundingEnd)}</h2>)
                                                                    }
                                                                </div>)}
                                                        </div>}

                                                </div>
                                            </div>

                                        </Fragment>
                                    </div>
                                ) : (<><div>
                                    <Fragment>
                                        <h1 className={styles.milestoneTitle}>Seed Funding Round</h1>
                                        <div style={{ display: "flex", flexDirection: "row", marginTop: "50px" }}>
                                            <p style={{ width: "50%", fontSize: "20px" }}>The Seed Funding round allows for the creator to gain initial seed funds to start their project. After this round, the creator will start progress toward their promises, milestone based rounds which funders of the project vote on upon their completion. </p>
                                            <div style={{ width: "50%", textAlign: "center" }}>
                                                <div style={{ fontSize: "40px" }}> <b style={{ color: "green", fontWeight: "400" }}>{amountRaisedPre.toLocaleString("en-US")}</b> {coinName}</div>
                                                <h1 style={{ fontSize: "15px" }}>raised in Seed Funding round</h1>
                                                {currState == 4 ? (
                                                    <div style={{ marginTop: "15px" }}>
                                                        <BorderLinearProgress variant="determinate" value={percent} />
                                                        <h2>Seed Round ends {convertSeconds(preFundingEnd)}</h2>
                                                    </div>
                                                ) : (
                                                    <div style={{ marginTop: "15px" }}>
                                                        <h2>Seed Round ended {convertSeconds(preFundingEnd)}</h2>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                    </Fragment>
                                </div></>)}
                            </div>
                        </Box>
                    </div>) : (<></>)
            }
        </div>




    );
}
