import FundCard from "./FundCard"
import { SetStateAction, useEffect, useState } from "react"
import { TextField } from "@mui/material"
import { propTypeFunds } from "../config/types"
import ShowMoreLess from "./ShowMoreLess"
import { ref, onValue } from "firebase/database"
import { database } from "../firebase-config"
import { useRouter } from "next/router"

export default function SearchBar(props: propTypeFunds) {
    const [filteredData, setFilteredData] = useState<string[]>(props.fundAddressArray)
    const [inputText, setInputText] = useState("")
    //shows only maxEntries amount... ShowMoreLess Component reveals more funds if they exist
    const [maxEntries, setMaxEntries] = useState(12)

    const router = useRouter()
    const category = router.query.category as string

    const handleFunds = (lowerCase: string) => {
        //convert input text to lower case
        setInputText(lowerCase)

        const newFilter = props.fundAddressArray.filter((fund) => {
            const categoryRef = ref(database, "funds/" + fund + "/category")
            let categoryValue = ""
            onValue(categoryRef, (snapshot) => {
                if (snapshot.val() && snapshot.val().toLowerCase() != category.toLowerCase()) {
                    categoryValue += snapshot.val()
                }
            })

            if (categoryValue && categoryValue.toLowerCase() != category.toLowerCase()) {
                return false
            }

            if (lowerCase == "") {
                return true
            }
            if (lowerCase.slice(0, 2) == "0x") {
                return fund.toLowerCase().includes(lowerCase)
            }
            let holder = ""

            const titleRef = ref(database, "funds/" + fund + "/fundTitle")
            onValue(titleRef, (snapshot) => {
                holder += snapshot.val()
            })
            const descriptionRef = ref(database, "funds/" + fund + "/description")
            onValue(descriptionRef, (snapshot) => {
                holder += snapshot.val()
            })

            return holder.toLowerCase().includes(lowerCase)
        })
        setFilteredData(newFilter)
    }

    let inputHandler = (e: { target: { value: string } }) => {
        handleFunds(e.target.value.toLowerCase())
    }

    useEffect(() => {
        setFilteredData(props.fundAddressArray.slice(0, maxEntries))
    }, [props.fundAddressArray, maxEntries])

    useEffect(() => {
        handleFunds("")
    }, [category, props.fundAddressArray])

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
            <h1 className="font-blog text-4xl text-slate-200">Discover Fundraisers in {category}</h1>
            <br></br>
            <div className="py-5 px-5">
                <ul className="flex flex-row flex-wrap">
                    {filteredData.map((fund) => (
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
                    />
                ) : (
                        <div></div>
                    )}
            </div>
        </>
    )
}
