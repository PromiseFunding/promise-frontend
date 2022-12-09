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
    const [amountActiveRaised, setAmountRaised] = useState(0)
    const [amountTotalRaised, setAmountTotalRaised] = useState(0)
    const [amountWithdrawableUser, setAmountWithdrawableUser] = useState(0)
    const [withdrewFunds, setFunderWithdraw] = useState(false)
    const [amountPreRaised, setAmountPreRaised] = useState(0)
    const [durationPreRound, setDurationPre] = useState(0)


    const getMilestones = async () => {
        const milestonesRef = ref(database, "funds/" + fundAddress + "/milestones")
        const snapshot = await get(milestonesRef)
        setMilestonesArray(snapshot.val())
        console.log(snapshot.val())
    }

    const { runContractFunction: didFunderWithdraw } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "didFunderWithdrawFunds",
        params: { funder: account },
    })

    const { runContractFunction: getFunderTrancheAmountRaised } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getFunderTrancheAmountRaised",
        params: { funder: account, level: activeStep - 1 },
    })

    const { runContractFunction: getTrancheAmountActiveRaised } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getTrancheAmountRaised",
        params: { level: activeStep - 1 },
    })

    const { runContractFunction: getTrancheAmountTotalRaised } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getTrancheAmountTotalRaised",
        params: { level: activeStep - 1 },
    })

    const { runContractFunction: getPreRoundTotalRaised } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getPreMilestoneTotalFunds",
        params: {},
    })

    const { runContractFunction: getPreRoundDuration } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getPreDuration",
        params: {},
    })

    async function updateUI() {
        const amountFundedFromCall = (await getFunderTrancheAmountRaised()) as number
        setAmountFunded(amountFundedFromCall / 10 ** decimals!)
        const amountRaisedFromCall = (await getTrancheAmountActiveRaised()) as number
        setAmountRaised(amountRaisedFromCall / 10 ** decimals!)
        const amountTotalRaisedFromCall = (await getTrancheAmountTotalRaised()) as number
        setAmountTotalRaised(amountTotalRaisedFromCall / 10 ** decimals!)
        const amountTotalPreRaisedFromCall = (await getPreRoundTotalRaised()) as number
        setAmountPreRaised(amountTotalPreRaisedFromCall / 10 ** decimals!)
        const getDurationPreRound = await getPreRoundDuration() as number
        setDurationPre(getDurationPreRound)
        const didFunderWithdrawFromCall = await didFunderWithdraw() as boolean
        setFunderWithdraw(didFunderWithdrawFromCall)
        //for user
        if (withdrewFunds){
            setAmountWithdrawableUser(0)
        }
        else{
            if (tranche! < activeStep){
                setAmountWithdrawableUser(amountFundedFromCall / 10 ** decimals!)
            }
            if(tranche! > activeStep){
                setAmountWithdrawableUser(0)
            }
            else{
                if(currState == 2){
                    setAmountWithdrawableUser(0)
                }
                else{
                    setAmountWithdrawableUser(amountFundedFromCall / 10 ** decimals!)
                }
            }
        }
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
                                        <StepButton color="inherit" onClick={handleStep(index+1)}>
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
                                ):(<><div>
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
