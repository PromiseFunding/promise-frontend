import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import NewFund from "../components/Newfund"
import Link from "next/link"
import { propInfoFund } from "../config/types"
import Button from "@mui/material/Button"
import { MouseEventHandler } from "react"


export default function InfoForm(props: propInfoFund) {
    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        props.onClickOK!()
      }

    return (
        <div className={styles.container}>
            <br></br>
            <div className="p-5">
                <h1 className="text-4xl font-bold text-black-header text-center">
                    Fundraiser Information and Options
                </h1>
                <br></br>
                <br></br>
                <h1 style={{ fontSize: "18px", textAlign: "center" }}>
                    The Promise platform enables 2 different types of fundraisers: each with their
                    own unique features and specific use cases.
                </h1>
                <br></br>
                <br></br>
                <h1 style={{ fontSize: "25px", fontWeight: "600" }}>
                    1. Promise Milestone Fundraiser:
                </h1>
                <br></br>
                <div>
                    <h1 style={{ fontSize: "18px", textAlign: "center" }}>
                        {" "}
                        The &apos;Promise Milestone Fundraiser&apos; or &apos;Promise Fund&apos;
                        for short is the primary type of fundraiser for this platform and enables
                        milestone based fundraising.
                    </h1>
                    <br></br>
                    <h1 style={{ fontSize: "20px", fontWeight: "500", marginLeft: "25px" }}>
                        a. Key Features:
                    </h1>
                    <ul
                        style={{
                            listStyleType: "circle",
                            marginTop: "10px",
                            fontSize: "18px",
                            marginLeft: "65px",
                        }}
                    >
                        <li>
                            Seed Funding: Prior to the milestone rounds, projects can receive seed
                            funding to kickstart their progress!
                        </li>
                        <li>
                            Milestone Rounds: Each milestone outlines the specific goals for your
                            project and a deadline. Users can donate to the current milestone or
                            spread out their donation over all the milestones.
                        </li>
                        <li>
                            Voting: In order to move on to the next milestone and collect the funds
                            deposited, a successful vote amongst the donors must take place.
                        </li>
                    </ul>
                    <br></br>
                    <h1 style={{ fontSize: "20px", fontWeight: "500", marginLeft: "25px" }}>
                        b. Use Cases:
                    </h1>
                    <ul
                        style={{
                            listStyleType: "circle",
                            marginTop: "10px",
                            fontSize: "18px",
                            marginLeft: "65px",
                        }}
                    >
                        <li>
                            Crowdfunding: If you have an idea for a project or product or you need
                            access to more funds without wanting to give up equity, this type of
                            fundraiser helps set it up for you!
                        </li>
                        <li>
                            Community Building: With the unique milestone based funding and voting
                            process, you can begin to build a reliable user/customer base to help
                            take your project to the next level.
                        </li>
                        <li>
                            Accountablity: Prove to future investors and users that your team has
                            what it takes to make a clear and concise roadmap and follow through on
                            all of your Promises!
                        </li>
                    </ul>
                    <br></br>
                    {/* <Link legacyBehavior href="/">
                        <a
                            className={styles.newFundButton}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "200px",
                                margin: "auto",
                            }}
                        >
                            Create Promise Fund
                        </a>
                    </Link> */}
                </div>
                <br></br>
                <br></br>
                <div>
                    <h1 style={{ fontSize: "25px", fontWeight: "600" }}>
                        2. Yield Generating Fundraiser:
                    </h1>
                    <br></br>
                    <h1 style={{ fontSize: "18px", textAlign: "center" }}>
                        {" "}
                        The &apos;Yield Generating Fundraiser&apos; or &apos;Yield Fund&apos; for
                        short is the secondary type of fundraiser for this platform and enables
                        donating interest accumulated from yield-generating protocols.
                    </h1>
                    <br></br>
                    <h1 style={{ fontSize: "20px", fontWeight: "500", marginLeft: "25px" }}>
                        a. Key Features:
                    </h1>
                    <ul
                        style={{
                            listStyleType: "circle",
                            marginTop: "10px",
                            fontSize: "18px",
                            marginLeft: "65px",
                        }}
                    >
                        <li>
                            Straight Donation: This type of fundraiser allows donors to donate
                            easily straight to your project.
                        </li>
                        <li>
                            Interest Donation: Donors can utilize a novel interest donation to fund
                            your project. Through this type of donation method the funds donated
                            are reallocated to the AAVE lending protocol where the interest is made
                            available for withdraw for you, and the donor can withdraw their
                            initial deposit.{" "}
                        </li>
                        <li>
                            Time Lock: Determine how long users must keep their funds in the
                            interest generating donation method before they can withdraw.
                        </li>
                    </ul>
                    <br></br>
                    <h1 style={{ fontSize: "20px", fontWeight: "500", marginLeft: "25px" }}>
                        b. Use Cases:
                    </h1>
                    <ul
                        style={{
                            listStyleType: "circle",
                            marginTop: "10px",
                            fontSize: "18px",
                            marginLeft: "65px",
                        }}
                    >
                        <li>
                            Crowdfunding: An easy way to start accepting donations for your cause
                            or use case with novel donation methods.
                        </li>
                    </ul>
                    <br></br>
                    {/* <Link legacyBehavior href="/">
                        <a
                            className={styles.newFundButton}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                width: "200px",
                                margin: "auto",
                            }}
                        >
                            Create Yield Fund
                        </a>
                    </Link> */}
                </div>
                <br></br>
                <br></br>
                <div>
                    <h1 style={{ fontSize: "25px", fontWeight: "600" }}>Recommendation:</h1>
                    <br></br>
                    <h1 style={{ fontSize: "18px" }}>
                        It is recommended that you weigh the pros and cons of each type of fundraiser and pick the one that best suits your purpose.
                        We believe that the &apos;Promise Fund&apos; is best suited for projects or products as it inherently builds a community and reputation. We also believe that the &apos;Yield Fund&apos; is best
                        suited for one time use cases or causes and charitable donations. Ultimately, however, the decision is up to you! Pick the fundraiser that you want to start, fill out the details very carefully and thoughtfully, and get started!
                    </h1>
                </div>
                <div>
                    <Button className={styles.buttonStyle} onClick={props.onClickOK()!} style={{ ['--override-color' as any]: "green" }}>OK</Button>
                </div>
            </div>
        </div>
    )
}