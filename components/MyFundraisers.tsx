import FundCard from "./FundCard"
import { SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { propTypeFunds } from "../config/types"
import Pages from "./Pagination"
import { ref, onValue, get } from "firebase/database"
import { database } from "../firebase-config"
import styles from "../styles/Home.module.css"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { OpenInBrowserRounded } from "@material-ui/icons"
import { ConstructionOutlined } from "@mui/icons-material"
import { contractAddressesInterface } from "../config/types"
import { contractAddresses, FundFactory } from "../constants"
import { ScrollMenu } from "react-horizontal-scrolling-menu"
import Box from "@mui/material/Box"
import { DEFAULT_CHAIN_ID } from "../config/helper-config"


export default function MyFundraisers() {
    const [donationsData, setDonationsData] = useState<string[]>([])
    const [ownerData, setOwnerData] = useState<string[]>([])
    const [windowWidth, setWindowWidth] = useState(0)
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = chainIdHex ? parseInt(chainIdHex!).toString() : DEFAULT_CHAIN_ID


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
        const listOfDonationFunds: string[] = []
        const listOfOwnedFunds: string[] = []

        var ownerRef = ref(database, chainId + "/users/" + account + "/owner")
        var donorRef = ref(database, chainId + "/users/" + account + "/donor")

        onValue(ownerRef, (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(function (childSnapshot) {
                    listOfOwnedFunds.push(childSnapshot.val().fundAddress)
                })
                setOwnerData(listOfOwnedFunds)
            } else {
                setOwnerData([])
            }
        })

        onValue(donorRef, (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(function (childSnapshot) {
                    listOfDonationFunds.push(childSnapshot.val().fundAddress)
                })
                setDonationsData(listOfDonationFunds)
            } else {
                setDonationsData([])
            }
        })
    }

    const calculatePaddingToggleDonor = (width: number): boolean => {
        const maxWidth = donationsData.length * 250 + (donationsData.length - 1) * 50 + 20

        if (width < maxWidth) {
            return true
        }
        return false
    }

    const calculatePaddingToggleOwner = (width: number): boolean => {
        const maxWidth = ownerData.length * 250 + (ownerData.length - 1) * 50 + 20

        if (width < maxWidth) {
            return true
        }
        return false
    }

    useEffect(() => {
        if (account && isWeb3Enabled) {
            updateUI()
        }
    }, [])

    useEffect(() => {
        if (account && isWeb3Enabled) {
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
                {ownerData.length > 0 ? (
                    <>
                        <h1 className="text-4xl font-bold text-black-header text-center">
                            Fundraisers You Own
                        </h1>
                        {!calculatePaddingToggleOwner(windowWidth) ? (
                            <Box my={2} display="flex" justifyContent="center">
                                {ownerData.map((fund) => (
                                    <li
                                        key={fund}
                                        style={{
                                            paddingTop: "5px",
                                            paddingBottom: "25px",
                                            margin: "25px",
                                        }}
                                    >
                                        <FundCard fund={fund}></FundCard>
                                    </li>
                                ))}
                            </Box>
                        ) : (
                            <ScrollMenu
                                options={{
                                    ratio: 0.9,
                                    rootMargin: "10px",
                                }}
                            >
                                {ownerData.map((fund) => (
                                    <li
                                        key={fund}
                                        style={{
                                            paddingTop: "5px",
                                            paddingBottom: "25px",
                                            margin: "25px",
                                        }}
                                    >
                                        <FundCard fund={fund}></FundCard>
                                    </li>
                                ))}
                            </ScrollMenu>
                        )}
                    </>
                ) : (
                    <></>
                )}

                <br></br>
                <br></br>
                {/* Donations */}
                {donationsData.length > 0 ? (
                    <>
                        <h1 className="text-4xl font-bold text-black-header text-center">
                            Fundraisers You Have Contributed To
                        </h1>
                        {!calculatePaddingToggleDonor(windowWidth) ? (
                            <Box my={2} display="flex" justifyContent="center">
                                {donationsData.map((fund, index) => (
                                    <li
                                        key={fund}
                                        style={{
                                            paddingTop: "5px",
                                            paddingBottom: "25px",
                                            margin: "25px",
                                        }}
                                    >
                                        <FundCard fund={fund}></FundCard>
                                    </li>
                                ))}
                            </Box>
                        ) : (
                            <ScrollMenu
                                options={{
                                    ratio: 0.9,
                                    rootMargin: "10px",
                                }}
                            >
                                {donationsData.map((fund, index) => (
                                    <li
                                        key={fund}
                                        style={{
                                            paddingTop: "5px",
                                            paddingBottom: "25px",
                                            margin: "25px",
                                        }}
                                    >
                                        <FundCard fund={fund}></FundCard>
                                    </li>
                                ))}
                            </ScrollMenu>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}
