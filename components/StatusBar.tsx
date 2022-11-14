import { SetStateAction, useEffect, useState, Fragment } from "react"
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { contractAddressesInterface, propType, milestone } from "../config/types"
import { ref, onValue, get } from "firebase/database"
import { database } from "../firebase-config"

const steps = ['Milestone 1', 'Milestone 2', 'Milestone 3', 'Milestone 4', 'Milestone 5'];

export default function HorizontalNonLinearStepper(props: propType) {
    const fundAddress = props.fundAddress
    const tranche = props.tranche

    const [activeStep, setActiveStep] = useState(0);
    const [milestonesArray, setMilestonesArray] = useState<milestone[]>([])

    const getMilestones = async () => {
        const milestonesRef = ref(database, "funds/" + fundAddress + "/milestones")
        const snapshot = await get(milestonesRef)
        setMilestonesArray(snapshot.val())
        console.log(snapshot.val())
    }

    useEffect(() => {
        getMilestones()
    }, [fundAddress])

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <div className="bg-slate-300 rounded p-10 border-2 border-slate-400">
            {
                milestonesArray.length > 0 ? (
                    <div>
                        <div className="pb-20">
                            <h1 className="text-5xl font-bold text-center text-slate-900">Milestone Overview:</h1>
                            <p className="text-center text-slate-900 pt-2"> Select a milestone to see the promises made for that period.</p>
                        </div>

                        <Box sx={{ width: '100%' }} >
                            <Stepper nonLinear activeStep={activeStep}>
                                {milestonesArray.map((milestone, index) => (
                                    <Step key={milestone.name} sx={{
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
                            <div>
                                <Fragment>
                                    <Typography className="font-blog font-bold text-black text-2xl" sx={{ mt: 2, mb: 1, py: 1, fontSize: 25 }}>
                                        {milestonesArray[activeStep].description.toString()}
                                    </Typography>

                                </Fragment>

                            </div>
                        </Box>
                    </div>) : (<></>)
            }
        </div>




    );
}
