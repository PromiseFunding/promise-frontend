import { contractAddresses, FundFactory } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { networkConfig } from "../config/helper-config"
import { tokenConfig } from "../config/token-config"
import { contractAddressesInterface } from "../config/types"
import { set, ref as refDb } from "firebase/database"
import { ref as refStore, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { database, storage } from "../firebase-config"

//contract is already deployed... trying to look at features of contract
export default function NewFund() {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const yieldAddress =
        chainId in addresses
            ? addresses[chainId]["FundFactory"][addresses[chainId]["FundFactory"].length - 1]
            : null
    const chainIdNum = parseInt(chainIdHex!)

    const [time, setTime] = useState("")

    const [assetValue, setAssetValue] = useState("USDC")

    const [assetAddress, setAssetAddress] = useState("")

    const [poolAddress, setPoolAddress] = useState("")

    const [aaveAddress, setAaveAddress] = useState("")

    const [decimalNumber, setDecimal] = useState(0)

    const [file, setFile] = useState<File>()

    const dispatch = useNotification()

    const {
        runContractFunction: createYieldFundAAVE,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: FundFactory,
        contractAddress: yieldAddress!,
        functionName: "createYieldFundAAVE",
        params: {
            lockTime: time,
            assetAddress: assetAddress,
            aaveTokenAddress: aaveAddress,
            poolAddress: poolAddress,
        },
    })

    useEffect(() => {
        if (isWeb3Enabled && yieldAddress) {
            handleChangeDetails()
        }
    }, [assetValue])

    const handleChangeAsset = (event: any) => {
        setAssetValue(event.target.value)
    }

    const handleNewFundraiser = async () => {
        const createTx: any = await createYieldFundAAVE()
        const fundAddress = await createTx.wait(1)
        console.log(fundAddress)
        // Get newly created YieldFund's address

        const iconRef = refStore(storage, `/files/${file!.name}`)
        const uploadTask = uploadBytesResumable(iconRef, file as Blob)
        let imageUrl
        uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    imageUrl = url
                    console.log(url)
                })
            }
        )

        set(refDb(database, "funds/" + "0x12345678912233213232"), {
            imageURL: imageUrl,
            email: "silas@lenihan.net",
        })
    }

    const handleChangeDetails = () => {
        const tokenAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].assetAddress : null
        const poolAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].poolAddress : null
        const aaveAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].aaveTokenAddress : null
        const decimal =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].decimals : null

        setDecimal(decimal!)
        setAssetAddress(tokenAddress!)
        setPoolAddress(poolAddress!)
        setAaveAddress(aaveAddress!)
    }

    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        //max for now is 20 years
        const max = 630720000
        if ((event.target.value as unknown as number) > 0) {
            const value = Math.max(
                0,
                Math.min(max as number, Number(Number(event.target.value).toFixed(0)))
            )
            setTime(value.toString())
        } else {
            setTime("0")
        }
    }

    function handleChangeImage(event: { target: { files: SetStateAction<any> } }) {
        setFile(event.target.files[0])
    }

    return (
        <div className="p-5 bg-slate-800 text-slate-200 rounded border-2 border-rose-500 flex flex-col">
            <h1 className="font-blog text-center text-3xl text-slate-200 border-b-2">
                Create a New Fund
            </h1>
            {isWeb3Enabled && yieldAddress ? (
                <div className="flex-col p-5">
                    <br></br>
                    <h1 className="font-blog text-2xl text-slate-200">
                        Enter a Title For your Fund:
                    </h1>
                    <input
                        maxLength={40}
                        type="string"
                        placeholder="My Fund"
                        id="title"
                        name="Title"
                        // onChange={handleChange}
                        // value={time}
                        autoComplete="off"
                        className="text-slate-800"
                    ></input>
                    <h1 className="font-blog text-2xl text-slate-200">
                        Enter a Description For your Fund:
                    </h1>
                    <textarea
                        className="text-slate-800"
                        id="w3review"
                        name="w3review"
                        placeholder="This fund is for..."
                        rows={4}
                        cols={50}
                    ></textarea>
                    <div>
                        <input type="file" accept="image/*" onChange={handleChangeImage} />
                    </div>
                    <h1 className="font-blog text-2xl text-slate-200">
                        Enter a locktime For your Fund:
                    </h1>
                    <input
                        maxLength={21 - (decimalNumber || 6)}
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0 seconds"
                        id="message"
                        name="Locktime"
                        onChange={handleChange}
                        value={time}
                        autoComplete="off"
                        className="text-slate-800"
                    />
                    <div>
                        <h1 className="font-blog text-2xl text-slate-200">Choose Asset:</h1>
                        <select
                            id="assetName"
                            onChange={handleChangeAsset}
                            className="text-slate-800"
                        >
                            <option value="USDC">USDC</option>
                            <option value="USDT">USDT</option>
                            <option value="DAI">DAI</option>
                            <option value="WETH">WETH</option>
                        </select>
                        <br></br>
                    </div>
                    <br></br>
                    <br></br>
                    <div className="text-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                            onClick={async function () {
                                handleNewFundraiser()
                            }}
                        >
                            <div>Create New Fundraiser</div>
                        </button>
                    </div>
                </div>
            ) : (
                <div>No Create Yield Address Detected</div>
            )}
        </div>
    )
}
