import FundCard from "./FundCard"
import { SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { TextField } from "@mui/material"
import { propTypeFunds } from "../config/types"
import ShowMoreLess from "./ShowMoreLess"
import { ref, onValue, get } from "firebase/database"
import { database } from "../firebase-config"

export default function SearchBar(props: propTypeFunds) {
    const [filteredData, setFilteredData] = useState<string[]>(props.fundAddressArray)
    const [inputText, setInputText] = useState("")
    //shows only maxEntries amount... ShowMoreLess Component reveals more funds if they exist
    const [maxEntries, setMaxEntries] = useState(12)

    const router = useRouter()
    const category = router.query.category as string || ""


    let inputHandler = (e: { target: { value: string } }) => {
        //convert input text to lower case
        let lowerCase = e.target.value.toLowerCase()

        setInputText(lowerCase)


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

    useEffect(() => {
        updateCategories()
    }, [props.fundAddressArray, maxEntries, category])

    useEffect(() => {
        setMaxEntries(12)
    }, [category])

    return (
        <>
            <div className="main text-center">
                <h1 className="p-5 font-blog text-lg text-center text-slate-200">
                    Search For Fundraiser
                </h1>
                <div className="search">
                    <TextField className="text-slate-200"
                        sx={{
                            width: 500,
                        }}
                        id="address-search"
                        onChange={inputHandler}
                        value={inputText}
                        variant="outlined"
                        label="Search"
                    />
                </div>
            </div>
            <br></br>
            <h1 className="font-blog text-4xl text-slate-200">Discover Fundraisers: {category}</h1>
            <br></br>
            <div className="py-5 px-5">
                <ul className="flex flex-row flex-wrap">
                    {filteredData.slice(0, maxEntries).map((fund) => (
                        <li key={fund} className="px-5 py-5">
                            <FundCard fund={fund}></FundCard>
                        </li>
                    ))}
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
