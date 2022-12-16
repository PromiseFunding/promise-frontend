import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from "../../styles/Home.module.css"


export default function HowItWorks() {
    return (
        <div style={{ textAlign: "center" }}>


            <div className={styles.howItWorksLanding} id="how-it-works">
                <div style={{ color: "white", fontSize: "50px", fontWeight: "700", marginTop: "20px" }}>
                    How It Works
                </div>
                <div className={styles.howItWorksLandingOuter}>
                    <div className={styles.howItWorksLandingInner}>
                        <div className={styles.howItWorksPanel}>
                            <h1>Start</h1>
                            <FontAwesomeIcon className={styles.howItWorksIcon} icon={["fas", "lightbulb"]} transform="shrink-4" />
                            <h2 style={{ fontSize: "20px", marginTop: "30px", fontWeight: "400" }}>Start with an idea. It can be anything: A new DeFi protocol, an artistic project, or a new type of physical product. Set goals and timelines for future milestones.</h2>
                        </div>
                        <div className={styles.howItWorksPanel}>
                            <h1>Seed</h1>
                            <FontAwesomeIcon className={styles.howItWorksIcon} icon={["fas", "seedling"]} size="6x" transform="shrink-4" />
                            <h2 style={{ fontSize: "20px", marginTop: "30px", fontWeight: "400" }}>After creation, a fundraiser goes through a pre-milestone funding round where they raise money to start progressing towards their milestones. </h2>
                        </div>
                    </div>
                    <div className={styles.howItWorksLandingInner}>
                        <div className={styles.howItWorksPanel}>
                            <h1>Progress</h1>
                            <FontAwesomeIcon className={styles.howItWorksIcon} icon={["fas", "list-check"]} size="6x" transform="shrink-4" />
                            <h2 style={{ fontSize: "20px", marginTop: "30px", fontWeight: "400" }}>With the initial capital, fundraisers can start progressing towards their goals. Funders hold votes after each milestone to ensure the fundraiser is keeping their promises. </h2>
                        </div>
                        <div className={styles.howItWorksPanel}>
                            <h1>Finish</h1>
                            <FontAwesomeIcon className={styles.howItWorksIcon} icon={["fas", "flag-checkered"]} size="6x" transform="shrink-4" />
                            <h2 style={{ fontSize: "20px", marginTop: "30px", fontWeight: "400" }}>After a successful promise fundraiser, both fundraiser and funder are rewarded by their symbiotic relationship. The fundraiser is set up perfectly. </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}
