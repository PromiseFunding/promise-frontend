import { contractAddresses, FundFactory } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { contractAddressesInterface } from "../config/types"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { CardActionArea } from "@mui/material"

//contract is already deployed... trying to look at features of contract
export default function FundsListed() {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const fundFactoryAddress =
        chainId in addresses
            ? addresses[chainId]["FundFactory"][addresses[chainId]["FundFactory"].length - 1]
            : null

    //TODO: get helper-config working instead!... gets rid of decimal function
    const [allFunds, setAllFunds] = useState<string[]>([])

    const { runContractFunction: getAllYieldFundsAAVE } = useWeb3Contract({
        abi: FundFactory,
        contractAddress: fundFactoryAddress!,
        functionName: "getAllYieldFundsAAVE",
        params: {},
    })

    async function updateUI() {
        const allFundsFromCall = (await getAllYieldFundsAAVE()) as string[]
        setAllFunds(allFundsFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled && fundFactoryAddress) {
            updateUI()
        }
    }, [isWeb3Enabled, fundFactoryAddress])

    return (
        <div className="py-5 px-5">
            {isWeb3Enabled && fundFactoryAddress ? (
                <ul className="flex flex-row flex-wrap">
                    {allFunds.map((fund) => (
                        // eslint-disable-next-line react/jsx-key
                        <li className="px-5 py-5">
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
