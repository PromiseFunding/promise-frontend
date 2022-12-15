import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from "../../styles/Home.module.css"


export default function Features() {
    return (<div className={styles.landingPageFeatures} id="features" >
        <h2 style={{ fontSize: "40px", fontWeight: "700", color: "black"}}>Features</h2>
        <div className={styles.featuresBlock}>
            <div className={styles.featuresBlockInner}>
                <div className={styles.featureCard} style={{ "--bg-color": "#694dcb" } as React.CSSProperties}>
                    <FontAwesomeIcon className={styles.featureIcon} icon={["fas", "scale-balanced"]} size="6x" mask={["fas", "square-full"]} transform="shrink-4" />
                    <h2>Trustlessness</h2>
                    <h3 className={styles.featureText}>Funders no longer have to trust the fundraiser to use their money correctly, since they govern the release of funds</h3>

                </div>
                <div className={styles.featureCard} style={{ "--bg-color": "#2f01a1" } as React.CSSProperties}>
                    <FontAwesomeIcon className={styles.featureIcon} icon={["fas", "cubes"]} size="6x" mask={["fas", "square-full"]} transform="shrink-4" />
                    <h2>Flexibility</h2>
                    <h3 className={styles.featureText}>Fundraiser Smart Contracts are customizable, modular, and fluid allowing them to cover a range of categories and styles</h3>
                </div>
            </div>
            <div className={styles.featuresBlockInner}>
                <div className={styles.featureCard} style={{ "--bg-color": "#410294" } as React.CSSProperties}>
                    <FontAwesomeIcon className={styles.featureIcon} icon={["fas", "bolt"]} size="6x" mask={["fas", "square-full"]} transform="shrink-4" />
                    <h2>Speed</h2>
                    <h3 className={styles.featureText}>Running on Layer 2, Promise is cheap and lightning fast enabling fundraiser creation and interaction in seconds</h3>
                </div>
                <div className={styles.featureCard} style={{ "--bg-color": "#09002b" } as React.CSSProperties}>
                    <FontAwesomeIcon className={styles.featureIcon} icon={["fas", "magnifying-glass-chart"]} size="6x" mask={["fas", "square-full"]} transform="shrink-4" />
                    <h2>Transparency</h2>
                    <h3 className={styles.featureText}>Promise Fundraisers have to be transparent by nature so the funders can keep track of the fundraiser&apos;s progress</h3>
                </div>
            </div>
        </div>
    </div>)
}
