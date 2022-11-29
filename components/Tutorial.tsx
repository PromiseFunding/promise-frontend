import styles from "../styles/Home.module.css"
import Image from "next/image"

export default function Tutorial() {

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div className={styles.tutorialPanel}>
                <div style={{
                    textAlign: "center", width: "50%"
                }}>
                    <Image src="/../public/info-images/idea/idea.png" height="800" width="800" alt="image"></Image>
                </div>
                <div className={styles.tutorialText} >
                    <div>
                        <h1 style={{ fontSize: "60px", fontWeight: "700" }}>It starts with an idea</h1>
                        <h2 style={{ fontSize: "40px" }}>Sitting on a new project idea? Maybe...</h2>
                        <ul style={{ marginTop: "10px", fontSize: "20px" }}>
                            <li>A New DeFi App?</li>
                            <li>An Artistic Venture?</li>
                            <li>A Revolutionary Product?</li>
                        </ul>

                    </div>

                </div>

            </div>
            <div className={styles.tutorialPanel}>
                <div className={styles.tutorialText} >
                    <div>
                        <h1 style={{ fontSize: "60px", fontWeight: "700" }}>Determine a timeline</h1>
                        <h2 style={{ fontSize: "40px" }}>Set milestones that will be achieved over the course of the fundraiser.</h2>
                    </div>

                </div>
                <div style={{
                    textAlign: "center", width: "50%"
                }}>
                    <Image src="/../public/info-images/idea/idea.png" height="800" width="800" alt="image"></Image>
                </div>


            </div>
            <div className={styles.tutorialPanel}>
                <div style={{ width: "80%", backgroundColor: "orange" }}></div>
                <div style={{ width: "20%", backgroundColor: "pink" }}></div>
            </div>
            <a href="http://www.freepik.com">Designed by vectorjuice / Freepik</a>
        </div >
    )
}
