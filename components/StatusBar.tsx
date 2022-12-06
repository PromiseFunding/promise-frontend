import { useEffect, useState, Fragment } from "react"
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { propType, milestone } from "../config/types"
import { ref, get } from "firebase/database"
import { database } from "../firebase-config"
import styles from "../styles/Home.module.css"
import NewMilestone from "./NewMilestone"
import { contractAddresses, abi, erc20Abi } from "../constants"
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

    const [activeStep, setActiveStep] = useState(0);
    const [milestonesArray, setMilestonesArray] = useState<milestone[]>([])
    const { isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const [amountFunded, setAmountFunded] = useState(0)
    const [amountRaised, setAmountRaised] = useState(0)


    const getMilestones = async () => {
        const milestonesRef = ref(database, "funds/" + fundAddress + "/milestones")
        const snapshot = await get(milestonesRef)
        setMilestonesArray(snapshot.val())
        console.log(snapshot.val())
    }

    const { runContractFunction: getFunderTrancheAmountRaised } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getFunderTrancheAmountRaised",
        params: { funder: account, level: activeStep},
    })

    const { runContractFunction: getTrancheAmountRaised } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getTrancheAmountRaised",
        params: { level: activeStep },
    })

    async function updateUI() {
        const amountFundedFromCall = (await getFunderTrancheAmountRaised()) as number
        setAmountFunded(amountFundedFromCall / 10 ** decimals!)
        const amountRaisedFromCall = (await getTrancheAmountRaised()) as number
        setAmountRaised(amountRaisedFromCall / 10 ** decimals!)
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            updateUI()
        }
    }, [activeStep, userAddress, totalRaised])

    useEffect(() => {
        getMilestones()
        updateUI()
    }, [fundAddress])

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <div className="bg-slate-300 rounded p-10 border-2 border-slate-400">
            {
                milestonesArray.length > 0 && milestoneDurations ? (
                    <div>
                        <div className="pb-20">
                            <h1 className="text-5xl font-bold text-center text-slate-900">Milestones Overview:</h1>
                            <p className="text-center text-slate-900 pt-2"> Select a milestone to see the promises made for that period.</p>
                        </div>

                        <Box sx={{ width: '100%' }} >
                            <Stepper nonLinear activeStep={activeStep}>
                                {milestonesArray.map((milestone, index) => (
                                    <Step key={index} sx={{
                                        '& .MuiStepLabel-root .Mui-completed': {
                                            color: 'green', // circle color (ACTIVE)
                                        },
                                    }} completed={index < tranche!}>
                                        <StepButton color="inherit" onClick={handleStep(index)}>
                                            {milestone.name}
                                        </StepButton>
                                    </Step>
                                ))}
                            </Stepper>
                            <br></br>
                            <br></br>
                            <div>
                                <Fragment>
                                    <h1 className="text-3xl font-bold text-left text-slate-900">Milestone {activeStep! + 1 } General Information:</h1>
                                    <Typography className={styles.textarea} sx={{ mt: 2, mb: 1, py: 1, fontSize: 25 }}>
                                        {`Milestone Duration: ${milestoneDurations![activeStep]}\nMilestone Description: ${milestonesArray[activeStep].description.toString()}`}
                                    </Typography>
                                    <br></br>
                                    {userAddress != owner ? (
                                        <><h1 className="text-3xl font-bold text-left text-slate-900">Milestone {activeStep! + 1} Funding Metrics:</h1><Typography className={styles.textarea} sx={{ mt: 2, mb: 1, py: 1, fontSize: 25 }}>
                                            {`Total Funded in Milestone: ${amountRaised} ${coinName}\nAmount You Have Donated in Milestone: ${amountFunded} ${coinName}`}
                                        </Typography></>
                                    ):(
                                        <><h1 className="text-3xl font-bold text-left text-slate-900">Milestone {activeStep! + 1} Funding Metrics:</h1><Typography className={styles.textarea} sx={{ mt: 2, mb: 1, py: 1, fontSize: 25 }}>
                                            {`Total Funded in Milestone: ${amountRaised} ${coinName}`}
                                        </Typography></>
                                    )}
                                </Fragment>
                            </div>
                            <br></br>
                            <div>
                                {milestoneDurations.length < 5 && userAddress == owner && currState != 3  && currState != 1 ? (<div>
                                    <NewMilestone
                                        fundAddress={fundAddress}
                                    />
                                </div> ) : (
                                    <></>
                                )}
                            </div>
                        </Box>
                    </div>) : (<></>)
            }
        </div>




    );
}
