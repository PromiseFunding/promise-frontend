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

    const [assetAddress, setAssetAddress] = useState("")

    const [decimalNumber, setDecimal] = useState(0)

    const [milestonesArray, setMilestonesArray] = useState<milestone[]>([{
        "name": "Milestone 1",
        "description": ""
    }])

    const [milestones, setMilestones] = useState("")

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
    }, [assetValue])

    const handleChangeAsset = (event: any) => {
        setAssetValue(event.target.value)
    }

    const handleNewFundraiser = async () => {
        if (category == "--" || !description || !assetValue || !file || !duration) {
            handleGenericAlert("Please fill in the required fields.")
            return
        }
        milestonesArray.map((milestone) => {
            if (milestone.description == "") {
                handleGenericAlert("Please fill all milestone descriptions.")
                return
            }
        })
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
        const poolAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].poolAddress : null
        const aaveAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].aaveTokenAddress : null
        const decimal =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].decimals : null

        setDecimal(decimal!)
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
                "name": `Milestone ${milestonesArray.length + 1}`,
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

    const handleChangeMilestones = (event: { target: { value: SetStateAction<string> } }) => {
        //max for now is 120 days
        const max = 5
        if ((event.target.value as unknown as number) > 0) {
            const value = Math.max(
                0,
                Math.min(max as number, Number(Number(event.target.value).toFixed(0)))
            )
            setMilestones(value.toString())
        } else {
            setMilestones("1")
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
                        onChange={handleChangeTitle}
                        value={title}
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
                        value={description}
                        onChange={handleChangeDescription}
                        placeholder="This fund is for..."
                        rows={4}
                        cols={50}
                    ></textarea>
                    <div>
                        <h1 className="font-blog text-2xl text-slate-200">Choose a category</h1>
                        <select
                            id="assetName"
                            onChange={handleChangeCategory}
                            className="text-slate-800"
                            value={category}
                        >
                            <option value="--">--</option>
                            <option value="Tech">Tech</option>
                            <option value="Film">Film</option>
                            <option value="Product">Product</option>
                            <option value="Gaming">Gaming</option>
                        </select>
                        <br></br>
                    </div>
                    <h1 className="font-blog text-2xl text-slate-200">Select an image:</h1>

                    <div>
                        <input type="file" accept="image/*" onChange={handleChangeImage} />
                    </div>
                    <br></br>

                    <div className="p-5 rounded border-2 border-black bg-slate-500">
                        <ul className="flex flex-col flex-wrap ">
                            {milestonesArray.map((curr, index) => (
                                <li key={index}>
                                    <h1 className="font-blog text-2xl text-slate-200">
                                        Milestone {index + 1}
                                    </h1>
                                    <input
                                        maxLength={40}
                                        type="string"
                                        placeholder="Milestone Name"
                                        id="title"
                                        name="Title"
                                        onChange={(e) => {
                                            handleChangeMilestoneName(e, index)
                                        }}
                                        value={milestonesArray[index].name}
                                        autoComplete="off"
                                        className="text-slate-800"
                                    ></input>
                                    <h1 className="font-blog text-2xl text-slate-200">
                                        Enter a specific, detailed, and complete description of the goals of this milestone:
                                    </h1>
                                    <textarea className={styles.textarea}
                                        id="w3review"
                                        name="w3review"
                                        value={milestonesArray[index].description}
                                        onChange={(e) => {
                                            handleChangeMilestoneDescription(e, index)
                                        }}
                                        placeholder="During this milestone we promise to..."
                                        rows={4}
                                        cols={50}
                                    ></textarea>

                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            newMilestone()
                        }}
                    >
                        <div>Add Milestone</div>
                    </button>

                    <h1 className="font-blog text-2xl text-slate-200">
                        Enter a duration for your milestones:
                    </h1>
                    <input
                        maxLength={21 - (decimalNumber || 6)}
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0 seconds"
                        id="message"
                        name="Duration"
                        onChange={handleChangeDuration}
                        value={duration}
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
            )
            }
        </div >
    )
}
