import * as React from "react"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import StatusBar from "./StatusBar"
import { propType } from "../../config/types"
import Updates from "./Updates"
import StatsYield from "./StatsYield"
import CommunityForumYield from "./CommunityForumYield"

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <div style={{ height: "100%" }}>{children}</div>}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    }
}

export default function TabsContentYield(props: propType) {
    const [value, setValue] = React.useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: "100%", height: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    centered
                >
                    <Tab sx={{ width: "33%" }} label="Updates" {...a11yProps(2)} />
                    <Tab sx={{ width: "33%" }} label="Overview" {...a11yProps(1)} />
                    <Tab sx={{ width: "33%" }} label="Connect" {...a11yProps(3)} />{" "}
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Updates fundAddress={props.fundAddress} ownerFund={props.ownerFund}></Updates>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <StatsYield
                    fundAddress={props.fundAddress}
                    fundSummary={props.fundSummary}
                    funderSummaryYield={props.funderSummaryYield}
                    decimals={props.decimals!}
                    coinName={props.coinName}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <CommunityForumYield
                    fundAddress={props.fundAddress}
                    fundSummary={props.fundSummary}
                    funderSummaryYield={props.funderSummaryYield}
                ></CommunityForumYield>
            </TabPanel>
        </Box>
    )
}
