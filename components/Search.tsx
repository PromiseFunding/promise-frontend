import FundCard from "./FundCard"
import { useEffect, useState } from "react"
import { TextField } from "@mui/material"
import { propTypeFunds } from "../config/types"
import { useMoralis } from "react-moralis"

export default function SearchBar(props: propTypeFunds) {
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const [filteredData, setFilteredData] = useState<string[]>(props.fundAddressArray)
    const [inputText, setInputText] = useState("")

    let inputHandler = (e: { target: { value: string } }) => {
        //convert input text to lower case
        var lowerCase = e.target.value.toLowerCase()
        setInputText(lowerCase)
        const newFilter = props.fundAddressArray.filter((value) => {
            return value.toLowerCase().includes(lowerCase)
        })

        if (inputText === "") {
            setFilteredData(props.fundAddressArray)
        } else {
            setFilteredData(newFilter)
        }
    }

    useEffect(() => {
        setFilteredData(props.fundAddressArray)
    }, [props.fundAddressArray])

    return (
        <>
            <div className="main text-center">
                <h1 className="font-blog text-lg text-center text-slate-200">
                    Search For Fundraiser by Address
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
            <h1 className="font-blog text-4xl text-slate-200">Discover Fundraisers</h1>
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
        </>
    )
}
