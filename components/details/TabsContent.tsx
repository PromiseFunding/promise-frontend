import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import StatusBar from "./StatusBar"
import { propType } from "../../config/types"
import Updates from "./Updates"
import Stats from "./Stats"
import CommunityForum from './CommunityForum';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div style={{ height: "100%" }}>{children}</div>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TabsContent(props: propType) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', height: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab sx={{ width: "25%" }} label="Milestones" {...a11yProps(0)} />
                    <Tab sx={{ width: "25%" }} label="Updates" {...a11yProps(1)} />
                    <Tab sx={{ width: "25%" }} label="Overview" {...a11yProps(2)} />
                    <Tab sx={{ width: "25%" }} label="Connect" {...a11yProps(3)} />

                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <StatusBar
                    fundAddress={props.fundAddress}
                    tranche={props.tranche}
                    milestoneDurations={props.milestoneDurations}
                    ownerFund={props.ownerFund}
                    decimals={props.decimals!}
                    userAddress={props.userAddress}
                    currState={props.currState}
                    totalRaised={props.totalRaised}
                    coinName={props.coinName}
                    milestoneSummary={props.milestoneSummary}
                    onChangeState={() => {
                        props.onChangeState!()
                    }} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Updates
                    fundAddress={props.fundAddress}
                    ownerFund={props.ownerFund}
                ></Updates>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Stats fundAddress={props.fundAddress}
                    milestoneSummary={props.milestoneSummary}
                    funderSummary={props.funderSummary}
                    decimals={props.decimals!}
                    coinName={props.coinName}
                />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <CommunityForum
                    fundAddress={props.fundAddress}
                    milestoneSummary={props.milestoneSummary}
                    funderSummary={props.funderSummary}
                ></CommunityForum>
            </TabPanel>
        </Box>
    );
}
