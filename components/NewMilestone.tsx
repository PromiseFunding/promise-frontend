import { contractAddresses, FundFactory, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { tokenConfig } from "../config/token-config"
import { set, get, ref as refDb } from "firebase/database"
import { ref as refStore, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { database, storage } from "../firebase-config"
import { milestone } from "../config/types"
import { contractAddressesInterface, propType } from "../config/types"
import styles from "../styles/Home.module.css"
import TextField from "@mui/material/TextField"
import { BigNumber } from "ethers"
import FormHelperText from "@mui/material/FormHelperText"
import FormControl from "@mui/material/FormControl"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"

export default function NewMilestone(props: propType) {
    const fundAddress = props.fundAddress

    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()

    const [numberofMilestones, setNumberofMilestones] = useState(5)
    const [milestoneDuration, setMilestoneDuration] = useState("")
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")

    const dispatch = useNotification()

    const {
        runContractFunction: addMilestone,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "addMilestone",
        params: {
            duration: BigNumber.from(Number(milestoneDuration).toString())
        },
    })

    const updateMilestoneLength = async () => {
        const milestoneRef = refDb(database, "funds/" + fundAddress + "/milestones")
        const snapshot = await get(milestoneRef)
        const milestoneVal = snapshot.val()
        setNumberofMilestones(milestoneVal.length)
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            updateMilestoneLength()
        }
    }, [isWeb3Enabled, fundAddress])

    const handleNewMilestone = async () => {
        let descriptionFull = true
        let nameFull = true
        let durationFull = true

        if (description == "") {
            descriptionFull = false
        }
        if (name == "") {
            nameFull = false
        }
        if (milestoneDuration == "") {
            durationFull = false
        }

        if (!descriptionFull) {
            handleGenericAlert("Please fill milestone description.")
            return
        }
        if (!nameFull) {
            handleGenericAlert("Please fill milestone name.")
            return
        }
        if (!durationFull) {
            handleGenericAlert("Please fill milestone duration.")
            return
        }
        const createTx: any = await addMilestone({
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

        set(refDb(database, `funds/${fundAddress}/milestones/${numberofMilestones - 1}`), {
            name: name,
            description: description,
            duration: milestoneDuration,
        })
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Successfully Added Milestone!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleNewNotificationError = function () {
        dispatch({
            type: "info",
            message: "Milesonte Addition Failed",
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

    // const newMilestone = () => {
    //     if (numberofMilestones < 5) {
            
    //     } else {
    //         handleGenericAlert("The maximum number of milestones is 5. Cannot Add Any More")
    //     }
    // }

    function handleChangeMilestoneName(event: { target: { value: SetStateAction<string> } }) {
        const nameOfMilestone = event.target.value as string
        setName(nameOfMilestone)
    }

    function handleChangeMilestoneDescription(event: {
        target: { value: SetStateAction<string> }
    }) {
        const descriptionOfMilestone = event.target.value as string
        setDescription(descriptionOfMilestone)
    }

    const handleChangeDuration = (event: { target: { value: SetStateAction<string> } }) => {
        //max for now is 120 days
        const max = 10368000
        let durationOfMilestone = ""
        if ((event.target.value as unknown as number) > 0) {
            const value = Math.max(
                0,
                Math.min(max as number, Number(Number(event.target.value).toFixed(0)))
            )
            durationOfMilestone = value.toString()
        } else {
            durationOfMilestone = ""
        }
        setMilestoneDuration(durationOfMilestone)
    }

    return (
        <div className={styles.newFund}>
            {/* <button
                className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded ml-auto"
                onClick={async function () {
                    newMilestone()
                }}
            >
            <div>Add Milestone</div>
            </button> */}
            {isWeb3Enabled && fundAddress ? (
                <Box>
                    <div style={{ width: "50%" }}>
                        <div className={styles.formSection}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "14px",
                                    width: "100%",
                                }}
                            >
                                <ul>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "14px",
                                                    paddingBottom: "20px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                    }}
                                                >
                                                    <TextField
                                                        id="outlined-basic"
                                                        label={`Milestone ${numberofMilestones + 1}`}
                                                        onChange={(e) => {
                                                            handleChangeMilestoneName(e)
                                                        }}
                                                        value={name}
                                                        helperText="Input a title for the milestone"
                                                        variant="filled"
                                                        style={{ width: "50%" }}
                                                    />
                                                    <TextField
                                                        type="number"
                                                        name="duration"
                                                        label="Milestone Duration"
                                                        variant="filled"
                                                        value={milestoneDuration}
                                                        onChange={(e) => {
                                                            handleChangeDuration(e)
                                                        }}
                                                        style={{
                                                            width: "50%",
                                                            paddingLeft: "10px",
                                                        }}
                                                        helperText="Duration of Milestones (seconds)"
                                                    />
                                                </div>

                                                <TextField
                                                    id="outlined-multiline-flexible"
                                                    label="Description"
                                                    multiline
                                                    rows={10}
                                                    onChange={(e) => {
                                                        handleChangeMilestoneDescription(e)
                                                    }}
                                                    variant="filled"
                                                />
                                            </div>
                                     
                                </ul>
                                <button
                                    className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded ml-auto"
                                    onClick={async function () {
                                        handleNewMilestone()
                                    }}
                                >
                                    <div>Add Milestone</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </Box>
            ) : (
                <div>No Create Yield Address Detected</div>
            )}
        </div>
    )
}
