import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Image from "next/image"
import Link from "next/link"
import FundCard from "./FundCard"
import { SetStateAction, useEffect, useState } from "react"
import { CardActionArea, TextField } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"
import { propType, propTypeFunds } from "../config/types"
import { useMoralis } from "react-moralis"
import ShowMoreLess from "./ShowMoreLess"
import { useNotification } from "web3uikit"
import { ref, onValue } from "firebase/database"
import { database } from "../firebase-config"

export default function SearchBar(props: propTypeFunds) {
    const [filteredData, setFilteredData] = useState<string[]>(props.fundAddressArray)
    const [inputText, setInputText] = useState("")
    //shows only maxEntries amount... ShowMoreLess Component reveals more funds if they exist
    const [maxEntries, setMaxEntries] = useState(12)

    let inputHandler = (e: { target: { value: string } }) => {
        //convert input text to lower case
        let lowerCase = e.target.value.toLowerCase()

        setInputText(lowerCase)

        if (lowerCase === "") {
            setFilteredData(props.fundAddressArray)
        } else {
            const newFilter = props.fundAddressArray.filter((fund) => {
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
    }

    useEffect(() => {
        setFilteredData(props.fundAddressArray.slice(0, maxEntries))
    }, [props.fundAddressArray, maxEntries])

    return (
        <>
            <div className="main text-center">
                <h1 className="font-blog text-lg text-center text-slate-200">
                    Search For Fundraiser
                </h1>
                <div className="search">
                    <TextField
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
            <h1 className="font-blog text-4xl text-slate-200">Discover Fundraisers Test</h1>
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
