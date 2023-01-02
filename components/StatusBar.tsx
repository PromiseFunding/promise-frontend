import { useEffect, useState, Fragment } from "react"
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { propType, milestone, funderSummary } from "../config/types"
import { ref, get } from "firebase/database"
import { database } from "../firebase-config"
import styles from "../styles/Home.module.css"
import NewMilestone from "./NewMilestone"
import { abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"

const steps = ['Milestone 1', 'Milestone 2', 'Milestone 3', 'Milestone 4', 'Milestone 5'];

export default function HorizontalNonLinearStepper(props: propType) {
    const fundAddress = props.fundAddress
    const tranche = props.tranche
    const milestoneDurations = props.milestoneDurations
    const decimals = props.decimals
    const coinName = props.coinName
    const userAddress = props.userAddress
    const currState = props.currState
    const totalRaised = props.totalRaised
    const owner = props.ownerFund
    const milestoneSummary = props.milestoneSummary
    const funderSummary = props.funderSummary

    const [activeStep, setActiveStep] = useState(0);
    const [milestonesArray, setMilestonesArray] = useState<milestone[]>([])
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const [amountFunded, setAmountFunded] = useState(0)
    const [amountActiveRaised, setAmountRaised] = useState(0)
    const [amountTotalRaised, setAmountTotalRaised] = useState(0)
    const [amountWithdrawableUser, setAmountWithdrawableUser] = useState(0)
    const [withdrewFunds, setFunderWithdraw] = useState(false)
    const [amountPreRaised, setAmountPreRaised] = useState(0)
    const [durationPreRound, setDurationPre] = useState(0)

    const chainId: string = parseInt(chainIdHex!).toString()

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
        const amountTotalPreRaisedFromCall = milestoneSummary!.preMilestoneTotalFunded
        const getDurationPreRound = milestoneSummary!.preFundingDuration.toNumber()
        const didFunderWithdrawFromCall = funderSummary!.didFunderWithdraw

        setAmountFunded(amountFundedFromCall / 10 ** decimals!)
        setAmountRaised(amountRaisedFromCall / 10 ** decimals!)
        setAmountTotalRaised(amountTotalRaisedFromCall / 10 ** decimals!)
        setAmountPreRaised(amountTotalPreRaisedFromCall / 10 ** decimals!)
        setDurationPre(getDurationPreRound)
        setFunderWithdraw(didFunderWithdrawFromCall)
        //for user
        if (withdrewFunds) {
            setAmountWithdrawableUser(0)
        }
        else {
            if (tranche! < activeStep) {
                setAmountWithdrawableUser(amountFundedFromCall / 10 ** decimals!)
            }
            if (tranche! > activeStep) {
                setAmountWithdrawableUser(0)
            }
            else {
                if (currState == 2) {
                    setAmountWithdrawableUser(0)
                }
                else {
                    setAmountWithdrawableUser(amountFundedFromCall / 10 ** decimals!)
                }
            }
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

    return (
        <div className={styles.milestoneSelector}>
            {
                milestonesArray.length > 0 && milestoneDurations ? (
                    <div>
                        <div className="pb-20">
                            <h1 className="text-5xl font-bold text-center text-slate-900">Fundraiser Overview</h1>
                            <p className="text-center text-slate-900 pt-2"> Select a round or milestone to see the promises and metrics for that period.</p>
                        </div>

                        <Box sx={{ width: '100%' }} >
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
                            <br></br>
                            <br></br>
                            <div>
                                {activeStep > 0 ? (
                                    <><div>
                                        <Fragment>
                                            <h1 className="text-3xl font-bold text-left text-slate-900">Milestone {activeStep!} General Information:</h1>
                                            <Typography className={styles.textarea} sx={{ mt: 2, mb: 1, py: 1, fontSize: 25 }}>
                                                {`Milestone Duration: ${milestoneDurations![activeStep - 1]} seconds\nMilestone Description: ${milestonesArray[activeStep - 1].description!.toString()}`}
                                            </Typography>
                                            <br></br>
                                            {userAddress != owner ? ((currState != 3) ? (
                                                <><h1 className="text-3xl font-bold text-left text-slate-900">Milestone {activeStep!} Funding Metrics:</h1><Typography className={styles.textarea} sx={{ mt: 2, mb: 1, py: 1, fontSize: 25 }}>
                                                    {`Total Raised in Milestone Over Lifetime: ${amountTotalRaised} ${coinName}\nTotal Actively in Escrow in Milestone From All Users: ${amountActiveRaised} ${coinName}\nTotal Amount You Have Donated in Milestone: ${amountFunded} ${coinName}\nAmount in Escrow/Withdrawable in Milestone for you if Fundraiser Failed: ${amountWithdrawableUser} ${coinName}`}
                                                </Typography></>) : (<><Typography className={styles.textarea} sx={{ mt: 2, mb: 1, py: 1, fontSize: 25 }}>{`Total Raised in Milestone Over Lifetime: ${amountTotalRaised} ${coinName}\nTotal Amount You Had Donated in Milestone: ${amountFunded} ${coinName}\nAmount Eligible to Withdraw From Milestone (Fundraiser Failed): ${amountWithdrawableUser} ${coinName}`}</Typography></>)
                                            ) : ((currState != 3) ? (
                                                <><h1 className="text-3xl font-bold text-left text-slate-900">Milestone {activeStep!} Funding Metrics:</h1><Typography className={styles.textarea} sx={{ mt: 2, mb: 1, py: 1, fontSize: 25 }}>
                                                    {`Total Raised in Milestone Over Lifetime: ${amountTotalRaised} ${coinName}\nTotal Actively in Escrow in Milestone: ${amountActiveRaised} ${coinName}`}
                                                </Typography></>
                                            ) : (<><Typography className={styles.textarea} sx={{ mt: 2, mb: 1, py: 1, fontSize: 25 }}>{`Total Raised in Milestone Over Lifetime: ${amountTotalRaised} ${coinName}\n Not Eligible to Withdraw Any More Funds. Funders Voted Against Continuing Fundraiser.`}</Typography></>))}
                                        </Fragment>
                                    </div><br></br><div>
                                            {milestoneDurations.length < 5 && userAddress == owner && currState != 3 && currState != 1 ? (<div>
                                                <NewMilestone
                                                    fundAddress={fundAddress} />
                                            </div>) : (
                                                <></>
                                            )}
                                        </div></>
                                ) : (<><div>
                                    <Fragment>
                                        <h1 className="text-3xl font-bold text-left text-slate-900">Seed Round Metrics:</h1>
                                        <Typography className={styles.textarea} sx={{ mt: 2, mb: 1, py: 1, fontSize: 25 }}>
                                            {`Seed Round Duration: ${durationPreRound} seconds\nTotal Raised in Seed Round: ${amountPreRaised} ${coinName}`}
                                        </Typography>
                                    </Fragment>
                                </div></>)}
                            </div>
                        </Box>
                    </div>) : (<></>)
            }
        </div>




    );
}
