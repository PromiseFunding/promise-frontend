import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function CustomizedAccordions() {
  const [expanded, setExpanded] = React.useState<string | false>('panel1');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <><div>
      <div style={{ justifyContent: "center", textAlign: "center", fontSize: "45px", fontWeight: "700"}}>Frequently Asked Questions</div>
      <br></br>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>What are the benefits of milestone based funding?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Milestone based funding allows donors to hold projects accountable as the pledged donations are only made available to the project if the donors vote in favor at the end of the milestone period. This mechanism allows for
            donors to donate to the current milestone round or spread the donation evenly across each milestone. If the donors vote against the project, then the funds promised to the remaining milestones are made available for withdrawal for the donors, therefore providing extra protection for donors.
            Milestone based funding is also perfect for early startups or projects looking to get funding without having to give up equity, while building an early community of donors that helped contribute to their success and proving their teams ability to make and meet their goals.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>How does voting work?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The owner of the project can call a maximum of 2 votes prior to the end of the milestone period. Each voting period is a minimum of a week to make sure donors and project owners can discuss and share their thoughts and progress and come to a decision. If the amount of 'Yes' votes is greater or equal to the amount of 'No' votes,
            the project met its milestone goals and gains access to the funds raised for that round. If an owner called for 2 votes and they both failed, the milestone did not meet its goal and the fundraiser has ended. If the owner has called for less than 2 votes prior to the end of the milestone period, then anyone can start a vote and the result of that vote is final. A successful vote immediately starts the next milestone round if it exists.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>How do withdrawals work and when do they become available?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            At the end of the Seed Funding Round, all the funds raised are made available for the fundraiser to withdraw. Once the owner withdrawals, the milestone rounds begin. At the end of each round, the vote determines who can withdraw their funds. A vote in favor of the fundraiser, allows the owner to withdraw the funds raised for that round.
            A vote against the fundraiser allows each donor to withdraw the amount they donated to that current milestone and any remaining milestones if they exist.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>What are the badges in the top left corners of the fundraisers on the discover page?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            There are two different types of badges, representing the two different types of fundraisers that are available on our platform. The purple badge with the letter 'P' represents our 'Promise' milestone based fundraiser. The yellow badge with the letter 'Y' represents our secondary fundraising option for one time causes and stands for yield generating fundraisers. Yield generating fundraisers allow donors to donate straight to the fundraiser or through a yield generating protocol which allows the donor to donate the interest earned.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
    <br></br>
    <div style={{ justifyContent: "center", textAlign: "center" }}>
        <a href="http://www.freepik.com" style={{ color: "black", textAlign: "center", width: "100%", marginTop: "50px" }}>Images designed by vectorjuice / Freepik</a>
    </div></>
  );
}
