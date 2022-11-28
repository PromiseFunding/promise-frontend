import { contractAddresses, FundFactory } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { tokenConfig } from "../config/token-config"
import { contractAddressesInterface } from "../config/types"
import { set, ref as refDb } from "firebase/database"
import { ref as refStore, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { database, storage } from "../firebase-config"
import { milestone } from "../config/types"
import styles from "../styles/Home.module.css"
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Image from "next/image"
import DeleteIcon from '@material-ui/icons/Delete';

const categories = ["--", "Tech", "Film", "Product", "Gaming"];


//contract is already deployed... trying to look at features of contract
export default function NewFund() {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const yieldAddress =
        chainId in addresses
            ? addresses[chainId]["PromiseFundFactory"][addresses[chainId]["PromiseFundFactory"].length - 1]
            : null
    const chainIdNum = parseInt(chainIdHex!)

    const [assetValue, setAssetValue] = useState("USDT")

    const [title, setTitle] = useState("")

    const [description, setDescription] = useState("")

    const [category, setCategory] = useState("--")

    const [assetAddress, setAssetAddress] = useState(chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].assetAddress : null)

    const [milestonesArray, setMilestonesArray] = useState<milestone[]>([{
        "name": "",
        "description": ""
    }])

    const [duration, setDuration] = useState("")

    const [file, setFile] = useState<File>()

    const dispatch = useNotification()

    const {
        runContractFunction: createPromiseFund,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: FundFactory,
        contractAddress: yieldAddress!,
        functionName: "createPromiseFund",
        params: {
            assetAddress: assetAddress,
            numberOfMilestones: milestonesArray.length,
            milestoneDuration: duration,
        },
    })

    useEffect(() => {
        if (isWeb3Enabled && yieldAddress) {
            handleChangeDetails()
        }
    }, [assetValue, isWeb3Enabled])

    const handleChangeAsset = (event: any) => {
        setAssetValue(event.target.value)
    }

    const handleNewFundraiser = async () => {
        console.log(assetAddress)
        if (category == "--" || !description || !assetValue || !file || !duration) {
            handleGenericAlert("Please fill in the required fields.")
            return
        }
        let descriptionFull = true
        let nameFull = true
        milestonesArray.map((milestone) => {
            if (milestone.description == "") {
                descriptionFull = false
            }
            if (milestone.name == "") {
                nameFull = false
            }
        })
        if (!descriptionFull) {
            handleGenericAlert("Please fill all milestone descriptions.")
            return
        }
        if (!nameFull) {
            handleGenericAlert("Please fill all milestone names.")
            return
        }
        const createTx: any = await createPromiseFund({
            onSuccess: (tx) => {
                handleSuccess(tx)
            },
            onError: (err) => {
                console.log(err)
                handleNewNotificationError()
                return
            },
        })
    }

    const handleSuccess = async (tx: any) => {
        const txReceipt = await tx.wait(1)

        handleNewNotification()

        const fundAddress = txReceipt.events[2].args.fundAddress

        const iconRef = refStore(storage, `/files/${fundAddress}/${file!.name}`)
        const uploadTask = uploadBytesResumable(iconRef, file as Blob)

        uploadTask.on(
            "state_changed",
            (snapshot) => { },
            (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    set(refDb(database, `funds/${fundAddress}`), {
                        fundTitle: title,
                        imageURL: url,
                        description: description,
                        category: category,
                        milestones: milestonesArray,
                        milestoneDuration: duration,
                        asset: assetValue,
                    })
                })
            }
        )
    }

    const handleChangeDetails = () => {
        const tokenAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].assetAddress : null

        setAssetAddress(tokenAddress!)
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Fund Creation Complete!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleNewNotificationError = function () {
        dispatch({
            type: "info",
            message: "Fund Creation Failed",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleGenericAlert = function (message: string) {
        dispatch({
            type: "error",
            message: message,
            title: "",
            position: "topR",
        })
    }

    const newMilestone = () => {
        if (milestonesArray.length < 5) {
            setMilestonesArray(milestonesArray => [...milestonesArray, {
                "name": "",
                "description": ""
            }])
        } else {
            handleGenericAlert("The maximum number of milestones is 5")
        }
    }

    const handleChangeDuration = (event: { target: { value: SetStateAction<string> } }) => {
        //max for now is 120 days
        const max = 10368000
        if ((event.target.value as unknown as number) > 0) {
            const value = Math.max(
                0,
                Math.min(max as number, Number(Number(event.target.value).toFixed(0)))
            )
            setDuration(value.toString())
        } else {
            setDuration("")
        }
    }

    function handleChangeImage(event: { target: { files: SetStateAction<any> } }) {
        setFile(event.target.files[0])
    }

    function handleChangeTitle(event: { target: { value: SetStateAction<string> } }) {
        setTitle(event.target.value)
    }

    function handleChangeDescription(event: { target: { value: SetStateAction<string> } }) {
        setDescription(event.target.value)
    }

    function handleChangeCategory(event: { target: { value: SetStateAction<string> } }) {
        setCategory(event.target.value)
    }

    function handleChangeMilestoneName(event: { target: { value: SetStateAction<string> } }, index: number) {
        let items = [...milestonesArray];
        let item = { ...items[index] };
        item.name = event.target.value as string;
        items[index] = item;
        setMilestonesArray(items)
    }

    function handleChangeMilestoneDescription(event: { target: { value: SetStateAction<string> } }, index: number) {
        let items = [...milestonesArray];
        let item = { ...items[index] };
        item.description = event.target.value as string;
        items[index] = item;
        setMilestonesArray(items)
    }

    function handleDeleteMilestone(index: number) {
        console.log(`Delete index ${index}`)
        let items = [...milestonesArray]
        items.splice(index, 1)
        setMilestonesArray(items)
    }

    return (
        <div className={styles.newFund}>
            <div className={styles.createNewFund}>
                <h1 style={{ position: "relative", fontWeight: "700" }}>Create A New Fund</h1>
            </div>
            {isWeb3Enabled && yieldAddress ? (
                <Box
                >
                    <div style={{
                        display: "flex", flexDirection: "row", width: "100%", gap: "40px", paddingRight: "50px", paddingLeft: "50px"
                    }}
                    >
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "50%"

                        }}>
                            <div className={styles.formSection}>
                                <TextField
                                    id="outlined-basic"
                                    label="Fund Title"
                                    variant="filled"
                                    onChange={handleChangeTitle}
                                    value={title}
                                    helperText="Input a title for your fund"
                                />
                                <FormControl variant="filled">
                                    <InputLabel>Category</InputLabel>

                                    <Select
                                        value={category}
                                        label="Category"
                                        onChange={handleChangeCategory}
                                    >
                                        <MenuItem value="--">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={"Tech"}>Tech</MenuItem>
                                        <MenuItem value={"Film"}>Film</MenuItem>
                                        <MenuItem value={"Product"}>Product</MenuItem>
                                        <MenuItem value={"Gaming"}>Gaming</MenuItem>
                                    </Select>
                                    <FormHelperText>Select a Category</FormHelperText>
                                </FormControl>
                                <FormControl variant="filled">
                                    <InputLabel>Asset</InputLabel>
                                    <Select
                                        value={assetValue}
                                        label="Category"
                                        onChange={handleChangeAsset}
                                    >
                                        <MenuItem value={"USDC"}>USDC</MenuItem>
                                        <MenuItem value={"USDT"}>USDT</MenuItem>
                                        <MenuItem value={"DAI"}>DAI</MenuItem>
                                        <MenuItem value={"WETH"}>WETH</MenuItem>
                                    </Select>
                                    <FormHelperText>The fund&apos;s accepted asset</FormHelperText>
                                </FormControl>
                            </div>

                            <TextField
                                id="outlined-multiline-flexible"
                                label="Description"
                                multiline
                                rows={10}
                                onChange={handleChangeDescription}
                                style={{ paddingBottom: "20px" }}
                                variant="filled"
                            />

                            <TextField
                                type="number"
                                name="duration"
                                label="Milestones Duration"
                                variant="filled"
                                value={duration}
                                onChange={handleChangeDuration}
                                style={{ width: "300px" }}
                                helperText="Duration of Milestones (seconds)"
                            />




                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignContent: "center", gap: "50px" }}>
                                <div style={{ display: "flex", gap: "20px", paddingTop: "20px" }}>
                                    <h1 style={{ fontSize: "26px", paddingLeft: "80px" }}>Select an image:</h1>
                                    <input type="file" accept="image/*" onChange={handleChangeImage} style={{ paddingTop: "7px" }} />
                                </div>
                                {file ? (
                                    <div >
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt="Fund Picture"
                                            width={500}
                                            height={500}
                                        />
                                    </div>
                                ) : (<div>
                                    <Image
                                        src={"/../public/image-preview.png"}
                                        alt="Fund Picture"
                                        width={500}
                                        height={500}
                                    />
                                </div>)}

                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-5xl py-5 px-8 rounded-lg mb-10"
                                    onClick={async function () {
                                        handleNewFundraiser()
                                    }}
                                >
                                    <div>Create New Fundraiser</div>
                                </button>
                            </div>
                        </div>
                        <div style={{ width: "50%", }}>
                            <div className={styles.formSection}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
                                    <ul>
                                        {milestonesArray.map((curr, index) => (
                                            <li key={index}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "20px" }}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <TextField
                                                            id="outlined-basic"
                                                            label={`Milestone ${index + 1}`}
                                                            onChange={(e) => {
                                                                handleChangeMilestoneName(e, index)
                                                            }}
                                                            value={milestonesArray[index].name}
                                                            helperText="Input a title for the milestone"
                                                            variant="filled"
                                                            style={{ width: "75%" }}
                                                        />
                                                        {milestonesArray.length > 1 ? (
                                                            <div style={{ paddingLeft: "30px", paddingTop: "15px" }}>
                                                                <DeleteIcon
                                                                    className={styles.deleteIcon}
                                                                    onClick={(e) => {
                                                                        handleDeleteMilestone(index)
                                                                    }} />
                                                            </div>) : (<></>)}


                                                    </div>

                                                    <TextField
                                                        id="outlined-multiline-flexible"
                                                        label="Description"
                                                        multiline
                                                        rows={10}
                                                        onChange={(e) => {
                                                            handleChangeMilestoneDescription(e, index)
                                                        }}
                                                        variant="filled"
                                                    />
                                                </div>


                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded ml-auto"
                                        onClick={async function () {
                                            newMilestone()
                                        }}
                                    >
                                        <div>Add Milestone</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            ) : (
                <div>No Create Yield Address Detected</div>
            )
            }
        </div >
    )
}
