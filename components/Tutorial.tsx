import styles from "../styles/Home.module.css"
import Image from "next/image"

export default function Tutorial() {

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div className={styles.howItWorks}>
                <h1 style={{ position: "relative", fontWeight: "700" }}>How it works</h1>
                <h2 className={styles.truncateLineClamp}>Promise enables milestone based funding. In other words, it ensures via secure Smart Contracts that fundraisers
                    follow through on their promises and are only given the money raised when they&apos;ve proven their goals have been met.</h2>
            </div>
            <div className={styles.container}>
                <div className={styles.tutorialPanel}>
                    <div style={{
                        textAlign: "center", width: "50%", marginTop: "auto", marginBottom: "auto"
                    }}>
                        <Image src="/info-images/idea/idea.png" height="800" width="800" alt="image"></Image>
                    </div>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "60px", fontWeight: "700" }}>It starts with an idea</h1>
                            <h2 style={{ fontSize: "30px" }}>Sitting on a new project idea? Maybe...</h2>
                            <ul style={{ marginTop: "10px", fontSize: "30px" }}>
                                <li>A New DeFi App?</li>
                                <li>An Artistic Venture?</li>
                                <li>A Revolutionary Product?</li>
                            </ul>
                            <h2 style={{ fontSize: "30px" }}>Promise is the place to fund it!</h2>
                        </div>
                    </div>
                </div>
                <div className={styles.tutorialPanel}>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "60px", fontWeight: "700" }}>Determine a timeline</h1>
                            <h2 style={{ fontSize: "30px" }}>Set milestones that will be achieved over the course of the fundraiser. These milestones are the core promises the fundraiser is making to its funders.</h2>
                        </div>
                    </div>
                    <div style={{
                        textAlign: "center", width: "50%", marginTop: "auto", marginBottom: "auto"
                    }}>
                        <Image src="/info-images/milestones2/milestones.png" height="800" width="800" alt="image"></Image>
                    </div>
                </div>
                <div className={styles.tutorialPanel}>
                    <div style={{
                        textAlign: "center", width: "50%", marginTop: "auto", marginBottom: "auto"
                    }}>
                        <Image src="/info-images/contract/contract.png" height="800" width="800" alt="image"></Image>
                    </div>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "60px", fontWeight: "700" }}>Agree on the terms of the fundraiser</h1>
                            <h2 style={{ fontSize: "30px" }}>Once the terms for the fundraiser are decided they are locked into a new Promise Smart Contract. Users will be able to interact with this contract when they donate, vote, and withdraw. Since it is a Smart Contract, the owner can never change the fundraiser&apos;s terms. </h2>
                        </div>
                    </div>
                </div>
                <div className={styles.tutorialPanel}>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "60px", fontWeight: "700" }}>Work towards goals</h1>
                            <h2 style={{ fontSize: "30px" }}>Over the course of the milestone, the fundraiser should be working hard to achieve their goals by the end of the milestone period.</h2>
                        </div>
                    </div>
                    <div style={{
                        textAlign: "center", width: "50%", marginTop: "auto", marginBottom: "auto"
                    }}>
                        <Image src="/info-images/working/working.png" height="400" width="800" alt="image"></Image>
                    </div>
                </div>
                <div className={styles.tutorialPanel}>
                    <div style={{
                        textAlign: "center", width: "50%", marginTop: "auto", marginBottom: "auto"
                    }}>
                        <Image src="/info-images/vote/vote.png" height="800" width="800" alt="image"></Image>
                    </div>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "60px", fontWeight: "700" }}>Accountability Voting</h1>
                            <h2 style={{ fontSize: "30px" }}>At the end of each milestone, the fundraiser owner communicates their progress with their funders. If the funders agree the fundraiser has held up the promises for the milestone, they receive the money.</h2>
                        </div>
                    </div>
                </div>
                <div className={styles.tutorialPanel}>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "60px", fontWeight: "700" }}>Success!</h1>
                            <h2 style={{ fontSize: "30px" }}>If a fundraiser follows through on all their promises they will be rewarded with the funds raised each milestone and at the end of the process will have a reliable customer base to start with.</h2>
                        </div>
                    </div>
                    <div style={{
                        textAlign: "center", width: "50%", marginTop: "auto", marginBottom: "auto"
                    }}>
                        <Image src="/info-images/approved/approved.png" height="800" width="800" alt="image"></Image>
                    </div>
                </div>
                <a href="http://www.freepik.com" style={{ color: "white", textAlign: "center" }}>Images designed by vectorjuice / Freepik</a>
            </div>
        </div >
    )
}
