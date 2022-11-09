import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { contractAddressesInterface, propType } from "../config/types"


const steps = ['Milestone 1', 'Milestone 2', 'Milestone 3', 'Milestone 4', 'Milestone 5'];

export default function HorizontalNonLinearStepper(props: propType) {
    const fundAddress = props.fundAddress
    const tranche = props.tranche

    const [activeStep, setActiveStep] = React.useState(0);

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <div className="bg-slate-300 rounded p-10">
            <div className="pb-20">
                <h1 className="text-5xl font-bold text-center text-slate-900">Milestone Overview:</h1>
                <p className="text-center text-slate-900 pt-2"> Select a milestone to see the promises made for that period.</p>
            </div>

            <Box sx={{ width: '100%' }} >
                <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label} sx={{
                            '& .MuiStepLabel-root .Mui-completed': {
                                color: 'green', // circle color (ACTIVE)
                            },
                        }} completed={index < tranche!}>
                            <StepButton color="inherit" onClick={handleStep(index)}>
                                {label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                <div>
                    <React.Fragment>
                        <Typography className="font-blog font-bold text-black text-2xl" sx={{ mt: 2, mb: 1, py: 1, fontSize: 25 }}>
                            This is what we do during this step
                        </Typography>
                    </React.Fragment>

                </div>
            </Box>
        </div>

    );
}
