import FundCard from "./FundCard"
import { SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { propTypeFunds } from "../config/types"
import Pages from "./Pagination"
import { ref, onValue, get } from "firebase/database"
import { database } from "../firebase-config"
import styles from "../styles/Home.module.css"
import { useMoralis } from "react-moralis"
import { OpenInBrowserRounded } from "@material-ui/icons"

export default function MyFundraisers(props: propTypeFunds) {
    const fundAddressArray = props.fundAddressArray
    const [donationsData, setDonationsData] = useState<string[]>([])
    const [ownerData, setOwnerData] = useState<string[]>([])
    const [windowWidth, setWindowWidth] = useState(0)
    const [page, setPage] = useState(1)
    const [userAddress, setAddress] = useState("0")

    const { isWeb3Enabled, account } = useMoralis()

    useWindowSize()

    function useWindowSize() {
        useEffect(() => {
            function handleResize() {
                setWindowWidth(window.innerWidth)
            }

            window.addEventListener("resize", handleResize)

            handleResize()

            return () => window.removeEventListener("resize", handleResize)
        }, [])
    }

    async function updateUI() {
        var ownerRef = ref(database, "users/" + account + "/owner")
        var donorRef = ref(database, "users/" + account + "/donations")

        const listOfDonationFunds: string[] = []
        const listOfOwnedFunds: string[] = []

        onValue(ownerRef, (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(function (childSnapshot) {
                    console.log(childSnapshot.val())
                    console.log(snapshot.val())
                    // add childSnapshot (fund address) to array if it is in props array (get rid of once chain Id exists in database)
                    if (fundAddressArray.indexOf(childSnapshot.val()) != -1) {
                        listOfOwnedFunds.push(childSnapshot.val())
                    }
                })
                setOwnerData(listOfOwnedFunds)
            } else {
                setOwnerData(listOfOwnedFunds)
            }
        })

        onValue(donorRef, (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(function (childSnapshot) {
                    // add childSnapshot (fund address) to array if it is in props array (get rid of once chain Id exists in database)
                    if (fundAddressArray.indexOf(childSnapshot.val()) != -1) {
                        listOfDonationFunds.push(childSnapshot.val())
                    }
                })
                setDonationsData(listOfDonationFunds)
            } else {
                setDonationsData(listOfDonationFunds)
            }
        })
    }

    // may have to change this to be specific to donations and another functions specific to owner
    const calculatePaddingToggle = (width: number): boolean => {
        const maxWidth =
            (donationsData.length + ownerData.length) * 250 +
            (donationsData.length + ownerData.length - 1) * 35 +
            20

        if (width < maxWidth) {
            return true
        }
        return false
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        if (account) {
            setPage(1)
            updateUI()
        }
    }, [account])

    return (
        <>
            <div
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    padding: "10px",
                }}
            >
                {/* Owned Funds */}
                <h1>Funds You Own</h1>
                <ul className={styles.funds} id="funds">
                    {ownerData.slice(0 + (page - 1) * 5, page * 5).map((fund) => (
                        <li key={fund} style={{ paddingTop: "25px", paddingBottom: "25px" }}>
                            <FundCard fund={fund}></FundCard>
                        </li>
                    ))}
                    <div
                        style={{
                            width: 250,
                            height: 0,
                            position: calculatePaddingToggle(windowWidth)
                                ? "relative"
                                : "absolute",
                        }}
                    ></div>
                    <div
                        style={{
                            width: 250,
                            height: 0,
                            position: calculatePaddingToggle(windowWidth)
                                ? "relative"
                                : "absolute",
                        }}
                    ></div>
                    <div
                        style={{
                            width: 250,
                            height: 0,
                            position: calculatePaddingToggle(windowWidth)
                                ? "relative"
                                : "absolute",
                        }}
                    ></div>
                    <div
                        style={{
                            width: 250,
                            height: 0,
                            position: calculatePaddingToggle(windowWidth)
                                ? "relative"
                                : "absolute",
                        }}
                    ></div>
                </ul>
                {ownerData.length != 0 ? (
                    <Pages
                        amount={ownerData.length}
                        onChangePage={(newAmount: SetStateAction<Number>) =>
                            setPage(Number(newAmount))
                        }
                    />
                ) : (
                    <></>
                )}
                {/* Donations */}
                <h1>Funds You Have Donated To</h1>
                <ul className={styles.funds} id="funds">
                    {donationsData.slice(0 + (page - 1) * 5, page * 5).map((fund) => (
                        <li key={fund} style={{ paddingTop: "25px", paddingBottom: "25px" }}>
                            <FundCard fund={fund}></FundCard>
                        </li>
                    ))}
                    <div
                        style={{
                            width: 250,
                            height: 0,
                            position: calculatePaddingToggle(windowWidth)
                                ? "relative"
                                : "absolute",
                        }}
                    ></div>
                    <div
                        style={{
                            width: 250,
                            height: 0,
                            position: calculatePaddingToggle(windowWidth)
                                ? "relative"
                                : "absolute",
                        }}
                    ></div>
                    <div
                        style={{
                            width: 250,
                            height: 0,
                            position: calculatePaddingToggle(windowWidth)
                                ? "relative"
                                : "absolute",
                        }}
                    ></div>
                    <div
                        style={{
                            width: 250,
                            height: 0,
                            position: calculatePaddingToggle(windowWidth)
                                ? "relative"
                                : "absolute",
                        }}
                    ></div>
                </ul>
                {donationsData.length != 0 ? (
                    <Pages
                        amount={donationsData.length}
                        onChangePage={(newAmount: SetStateAction<Number>) =>
                            setPage(Number(newAmount))
                        }
                    />
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}
