import { contractAddresses, FundFactory } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { contractAddressesInterface, propTypeFunds } from "../config/types"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { CardActionArea } from "@mui/material"

//contract is already deployed... trying to look at features of contract
export default function FundsListed(props: propTypeFunds) {
    const allFunds = props.fundAddressArray

    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundFactoryAddress =
        chainId in addresses
            ? addresses[chainId]["FundFactory"][addresses[chainId]["FundFactory"].length - 1]
            : null


    return (
        <div className="py-5 px-5">
            {isWeb3Enabled && fundFactoryAddress ? (
                <ul className="flex flex-row flex-wrap">
                    {allFunds.map((fund) => (
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
            ) : (
                <div>No Fund Address Detected</div>
            )}
        </div>
    )
}
