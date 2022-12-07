import FundCard from "./FundCard"
import { SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { propTypeFunds } from "../config/types"
import ShowMoreLess from "./ShowMoreLess"
import { ref, onValue, get } from "firebase/database"
import { database } from "../firebase-config"
import styles from "../styles/Home.module.css"

export default function Search(props: propTypeFunds) {
    const [filteredData, setFilteredData] = useState<string[]>(props.fundAddressArray)
    const [maxEntries, setMaxEntries] = useState(12)
    const [windowWidth, setWindowWidth] = useState(0)
    const [invisPadding, setInvisPadding] = useState(false)

    const router = useRouter()
    const category = router.query.category as string || ""

    // inputHandler("")
    useWindowSize()

    function useWindowSize() {
        useEffect(() => {
            function handleResize() {
                setWindowWidth(window.innerWidth)
            }

            window.addEventListener("resize", handleResize);

            handleResize();

            return () => window.removeEventListener("resize", handleResize);
        }, []);
    }


    function inputHandler(query: string) {
        let lowerCase = query.toLowerCase()

        const newFilter = props.fundAddressArray.filter((fund) => {
            let holder = ""
            let categoryVal = ""
            const categoryRef = ref(database, "funds/" + fund + "/category")

            onValue(categoryRef, (snapshot) => {
                categoryVal += snapshot.val()
            })

            const categoryMatch = category == "" ? true : categoryVal.toLowerCase() == category.toLowerCase()

            if (lowerCase.slice(0, 2) == "0x") {
                return fund.toLowerCase().includes(lowerCase) && categoryMatch
            }

            if (lowerCase === "" && categoryMatch) {
                return true
            } else {
                const titleRef = ref(database, "funds/" + fund + "/fundTitle")
                onValue(titleRef, (snapshot) => {
                    holder += snapshot.val()
                })
                const descriptionRef = ref(database, "funds/" + fund + "/description")
                onValue(descriptionRef, (snapshot) => {
                    holder += snapshot.val()
                })
                return holder.toLowerCase().includes(lowerCase) && categoryMatch
            }
        })

        setFilteredData(newFilter)
    }

    const filterCategories = async (funds: string[]) => {
        const newFilter: string[] = []

        if (category == "") {
            return funds
        } else {
            for (const fund of funds) {
                const categoryRef = ref(database, "funds/" + fund + "/category")
                const snapshot = await get(categoryRef)
                const categoryVal = snapshot.val()
                if (categoryVal && categoryVal.toLowerCase() == category.toLowerCase()) {
                    newFilter.push(fund)
                }
            }
        }

        return newFilter

    }

    const updateCategories = async () => {
        filterCategories(props.fundAddressArray).then((value) => {
            setFilteredData(value)
        })
    }

    const calculatePaddingToggle = (width: number): boolean => {
        const maxWidth = (filteredData.length * 250 + (filteredData.length - 1) * 35) + 20
        console.log(width, maxWidth)

        if (width < maxWidth) {
            return true;
        }
        return false;
    }

    useEffect(() => {
        inputHandler(props.query!)
    }, [props.query])

    useEffect(() => {
        updateCategories()
    }, [props.fundAddressArray, maxEntries, category])

    useEffect(() => {
        setMaxEntries(12)
    }, [category])

    return (
        <>
            <div style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "100%", padding: "10px" }}>
                <ul className={styles.funds} id="funds">
                    {filteredData.slice(0, maxEntries).map((fund) => (
                        <li key={fund} style={{ paddingTop: "25px", paddingBottom: "25px" }}>
                            <FundCard fund={fund}></FundCard>
                        </li>
                    ))}
                    <div style={{ width: 250, height: 0, position: calculatePaddingToggle(windowWidth) ? "relative" : "absolute" }}></div>
                    <div style={{ width: 250, height: 0, position: calculatePaddingToggle(windowWidth) ? "relative" : "absolute" }}></div>
                    <div style={{ width: 250, height: 0, position: calculatePaddingToggle(windowWidth) ? "relative" : "absolute" }}></div>
                    <div style={{ width: 250, height: 0, position: calculatePaddingToggle(windowWidth) ? "relative" : "absolute" }}></div>
                </ul>
            </div>
            <div>
                <br></br>
                {filteredData.length > maxEntries ? (

                    <ShowMoreLess
                        amount={maxEntries}
                        onChangeAmount={(newAmount: SetStateAction<Number>) =>
                            setMaxEntries(Number(newAmount))
                        }
                    />) : (<div></div>
                )}
            </div>
        </>
    )
}
