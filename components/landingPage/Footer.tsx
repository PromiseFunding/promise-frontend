import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from "../../styles/Home.module.css"
import Link from 'next/link';
import Image from 'next/image';


export default function Features() {
    function handleScroll(section: string) {
        const element = document.getElementById(section);

        element!.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    }

    return (
        <div className={styles.landingFooter}>
            <div style={{marginTop: "auto", marginBottom: "auto", marginLeft: "20px" }}>
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/yieldme-39169.appspot.com/o/app%2Fimages%2Fpromise-logo.png?alt=media&token=8a440e85-05db-4da0-acb1-88d61d56c4f6"
                    alt="Picture of the author"
                    width={75}
                    height={75}
                />
            </div>

            <div className={styles.landingFooterNav}>
                <button type="button" className={styles.launchPageHeaderItem} onClick={(e) => {
                    handleScroll("about")
                }}>About</button>
                <button type="button" className={styles.launchPageHeaderItem} onClick={(e) => {
                    handleScroll("features")
                }}>Features</button>
                <button type="button" className={styles.launchPageHeaderItem} onClick={(e) => {
                    handleScroll("how-it-works")
                }}>How It Works</button>
                <div className={styles.launchPageHeaderItem}>Contact</div>
                <Link className={styles.launchPageHeaderItem} href="https://github.com/PromiseFunding">GitHub        </Link>
            </div>
        </div >)
}
