import React from "react"
import styles from "../styles/Home.module.css"
import Link from "next/link"

const Navbar = () => {
    return (
        <nav className={styles.mainnav}>
            <ul>
                <Link href="/">
                    <a>
                        <li>Home</li>
                    </a>
                </Link>
                <Link href="/form">
                    <a>
                        <li>Create New Fund</li>
                    </a>
                </Link>
            </ul>
        </nav>
    )
}

export default Navbar
