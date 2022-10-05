import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { CardActionArea, TextField } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"
import { propType, propTypeFunds } from "../config/types"

export default function SearchBar(props: propTypeFunds) {
    const [filteredData, setFilteredData] = useState<string[]>([])
    const [inputText, setInputText] = useState("")

    let inputHandler = (e: { target: { value: string } }) => {
        //convert input text to lower case
        var lowerCase = e.target.value.toLowerCase()
        setInputText(lowerCase)
        const newFilter = props.fundAddressArray.filter((value) => {
            return value.toLowerCase().includes(lowerCase)
        })

        if (inputText === "") {
            setFilteredData([])
        } else {
            setFilteredData(newFilter)
        }
    }

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
                {inputText != "" ? (
                    <ul className="flex flex-row flex-wrap">
                        {filteredData.map((fund) => (
                            <li key={fund} className="px-5 py-5">
                                {" "}
                                <Card sx={{ maxWidth: 345, minHeight: 250 }}>
                                    <CardActionArea href={`/details/?fund=${fund}`}>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                Fundraiser at {fund}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            ></Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul className="flex flex-row flex-wrap">
                        {props.fundAddressArray.map((fund) => (
                            // eslint-disable-next-line react/jsx-key
                            <li key={fund} className="px-5 py-5">
                                {" "}
                                <Card sx={{ maxWidth: 345, minHeight: 250 }}>
                                    <CardActionArea href={`/details/?fund=${fund}`}>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                Fundraiser at {fund}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            ></Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}
