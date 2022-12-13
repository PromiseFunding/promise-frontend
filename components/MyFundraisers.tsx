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

export default function MyFundraisers() {
    const [donationsData, setDonationsData] = useState<string[]>([])
    const [ownerData, setOwnerData] = useState<string[]>([])
    const [windowWidth, setWindowWidth] = useState(0)
    const [page, setPage] = useState(1)
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundFactoryAddress =
        chainId in addresses
            ? addresses[chainId]["PromiseFundFactory"][
                  addresses[chainId]["PromiseFundFactory"].length - 1
              ]
            : null

    const [allFunds, setAllFunds] = useState<string[]>([])

    const { runContractFunction: getAllPromiseFund } = useWeb3Contract({
        abi: FundFactory,
        contractAddress: fundFactoryAddress!,
        functionName: "getAllPromiseFund",
        params: {},
    })

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
        const allFundsFromCall = (await getAllPromiseFund()) as string[]
        setAllFunds(allFundsFromCall)

        const listOfDonationFunds: string[] = []
        const listOfOwnedFunds: string[] = []

        var ownerRef = ref(database, "users/" + account + "/owner")
        var donorRef = ref(database, "users/" + account + "/donations")

        onValue(ownerRef, (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(function (childSnapshot) {
                    // add childSnapshot (fund address) to array if it is in props array (get rid of once chain Id exists in database)
                    if (allFundsFromCall.indexOf(childSnapshot.val().fundAddress) != -1) {
                        listOfOwnedFunds.push(childSnapshot.val().fundAddress)
                    }
                })
                setOwnerData(listOfOwnedFunds)
            } else {
                setOwnerData([])
            }
        })

        onValue(donorRef, (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(function (childSnapshot) {
                    // add childSnapshot (fund address) to array if it is in props array (get rid of once chain Id exists in database)
                    if (allFundsFromCall.indexOf(childSnapshot.val()) != -1) {
                        listOfDonationFunds.push(childSnapshot.val())
                    }
                })
                setDonationsData(listOfDonationFunds)
            } else {
                setDonationsData([])
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
        if (account && isWeb3Enabled) {
            setPage(1)
            updateUI()
        }
    }, [])

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
                        <h1 className="text-4xl font-bold text-slate-200 text-center">
                            Funds You Own
                        </h1>
                        <ul className={styles.funds} id="funds">
                            {ownerData.slice(0 + (page - 1) * 5, page * 5).map((fund) => (
                                <li
                                    key={fund}
                                    style={{ paddingTop: "25px", paddingBottom: "25px" }}
                                >
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
                    </>
                ) : (
                    <></>
                )}

                <br></br>
                {/* Donations */}
                {donationsData.length > 0 ? (
                    <>
                        <h1 className="text-4xl font-bold text-slate-200 text-center">
                            Funds You Have Contributed To
                        </h1>
                        <ul className={styles.funds} id="funds">
                            {donationsData.slice(0 + (page - 1) * 5, page * 5).map((fund) => (
                                <li
                                    key={fund}
                                    style={{ paddingTop: "25px", paddingBottom: "25px" }}
                                >
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
                                amount={donationsData.length}
                                onChangePage={(newAmount: SetStateAction<Number>) =>
                                    setPage(Number(newAmount))
                                }
                            />
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    )
}
