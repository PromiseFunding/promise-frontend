import styles from "../styles/Home.module.css"
import Image from "next/image"

export default function Tutorial() {

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div className={styles.howItWorks}>
                <div style={{ verticalAlign: "middle", display: "table-cell" }}>
                    <h1 style={{ position: "relative", fontWeight: "700" }}>How it works</h1>
                    <h2 className={styles.truncateLineClamp}>Promise enables milestone based funding. In other words, it ensures via secure Smart Contracts that fundraisers
                        follow through on their promises and are only given the money raised when they&apos;ve proven their goals have been met.</h2>
                </div>

            </div>
            <div className={styles.howItWorksContainer}>
                <div className={styles.tutorialPanel}>
                    <div className={styles.tutorialImage}>
                        <Image src="/info-images/idea/idea.png" height="500" width="500" alt="image" style={{ marginLeft: "auto", marginRight: "auto" }}></Image>
                    </div>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "50px", fontWeight: "700" }}>It starts with an idea</h1>
                            <h2 style={{ fontSize: "20px" }}>Sitting on a new project idea? Maybe...</h2>
                            <ul style={{ marginTop: "10px", fontSize: "30px" }}>
                                <li>A New DeFi App?</li>
                                <li>An Artistic Venture?</li>
                                <li>A Revolutionary Product?</li>
                            </ul>
                            <h2 style={{ fontSize: "20px" }}>Promise is the place to fund it!</h2>
                        </div>
                    </div>
                </div>
                <div className={styles.tutorialPanel}>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "50px", fontWeight: "700" }}>Determine a timeline</h1>
                            <h2 style={{ fontSize: "20px" }}>Set clear milestones that will be achieved over the course of the fundraiser. These milestones are the core promises the fundraiser is making to its funders.</h2>
                        </div>
                    </div>
                    <div className={styles.tutorialImage}>
                        <Image src="/info-images/milestones2/milestones.png" height="500" width="500" alt="image" style={{ marginLeft: "auto", marginRight: "auto" }}></Image>
                    </div>
                </div>
                <div className={styles.tutorialPanel}>
                    <div className={styles.tutorialImage}>
                        <Image src="/info-images/contract/contract.png" height="500" width="500" alt="image" style={{ marginLeft: "auto", marginRight: "auto" }}></Image>
                    </div>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "50px", fontWeight: "700" }}>Agree on the terms of the fundraiser</h1>
                            <h2 style={{ fontSize: "20px" }}>Once the terms for the fundraiser are decided they are locked into a new Promise Smart Contract. Users will be able to interact with this contract when they donate, vote, and withdraw. Since it is a Smart Contract, the owner can never change the fundraiser&apos;s terms and users can track their funds. </h2>
                        </div>
                    </div>
                </div>
                <div className={styles.tutorialPanel}>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "50px", fontWeight: "700" }}>Work towards goals</h1>
                            <h2 style={{ fontSize: "20px" }}>After a seed funding round to kickstart the project, the milestone based funding begins. Over the course of each milestone, the fundraiser should be working hard to achieve the goals established for the period. On their fundraiser page, owners of the project can provide periodic updates as well as link a discord chat to better communicate their progress and thoughts with their community.</h2>
                        </div>
                    </div>
                    <div className={styles.tutorialImage}>
                        <Image src="/info-images/working/working.png" height="400" width="800" alt="image" style={{ marginLeft: "auto", marginRight: "auto" }}></Image>
                    </div>
                </div>
                <div className={styles.tutorialPanel}>
                    <div className={styles.tutorialImage}>
                        <Image src="/info-images/vote/vote.png" height="500" width="500" alt="image" style={{ marginLeft: "auto", marginRight: "auto" }}></Image>
                    </div>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "50px", fontWeight: "700" }}>Accountability Voting</h1>
                            <h2 style={{ fontSize: "20px" }}>At the end of each milestone, the fundraiser owner has communicated their progress with their funders and a voting period begins. If the funders agree the fundraiser has held up the promises for the milestone, the fundraiser receives the money and the fundraiser continues. If not, the funders of the milestone and future milestones get their money back and the fundraiser is ended.</h2>
                        </div>
                    </div>
                </div>
                <div className={styles.tutorialPanel}>
                    <div className={styles.tutorialText} >
                        <div>
                            <h1 style={{ fontSize: "50px", fontWeight: "700" }}>Success!</h1>
                            <h2 style={{ fontSize: "20px" }}>If a fundraiser follows through on all their promises they will be rewarded with the funds raised each milestone and at the end of the process will have a reliable customer base to begin with.</h2>
                        </div>
                    </div>
                    <div className={styles.tutorialImage}>
                        <Image src="/info-images/approved/approved.png" height="500" width="500" alt="image" style={{ marginLeft: "auto", marginRight: "auto" }}></Image>
                    </div>
                </div>
            </div>
            <a href="http://www.freepik.com" style={{ color: "black", textAlign: "center", width: "100%", marginTop: "50px" }}>Images designed by vectorjuice / Freepik</a>
        </div >
    )
}
