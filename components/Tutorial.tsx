import styles from "../styles/Home.module.css"
import Image from "next/image"

export default function Tutorial() {

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div className={styles.tutorialPanel}>
                <div style={{
                    textAlign: "center", width: "40%"
                }}>
                    <Image src="/../public/info-images/idea/idea.png" height="800" width="800" alt="image"></Image>
                </div>
                <div className={styles.tutorialText} >
                    Create your idea.
                </div>
            </div>
            <div className={styles.tutorialPanel}>
                <div className={styles.tutorialText} >

                </div>
                <div style={{
                    textAlign: "center", width: "75%", backgroundColor: "yellow"
                }}>
                    <Image src="/../public/info-images/idea/contract.png" height="800" width="800" alt="image"></Image>
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
