import { contractAddresses, FundFactory, abi } from "../../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { tokenConfig } from "../../config/token-config"
import { set, get, ref as refDb } from "firebase/database"
import { database, storage } from "../../firebase-config"
import { milestone } from "../../config/types"
import { contractAddressesInterface, propType } from "../../config/types"
import styles from "../../styles/details/details.module.css"
import TextField from "@mui/material/TextField"
import Modal from '@mui/material/Modal';
import { BigNumber, ContractTransaction } from "ethers"
import Button from '@mui/material/Button';

import Box from "@mui/material/Box"

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    height: "90%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: "25px"
}

export default function NewMilestone(props: propType) {
    const fundAddress = props.fundAddress

    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()
    const [numberofMilestones, setNumberofMilestones] = useState(5)
    const [milestoneDuration, setMilestoneDuration] = useState("")
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")
    const [open, setOpen] = useState(false)


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
        const milestoneRef = refDb(database, chainId + "/funds/" + fundAddress + "/milestones")
        const snapshot = await get(milestoneRef)
        const milestoneVal = snapshot.val()
        setNumberofMilestones(milestoneVal.length)
    }

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            updateMilestoneLength()
        }
    }, [isWeb3Enabled, fundAddress])

    const handleClose = () => {
        setOpen(false)
    }

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
                handleClose()
                handleSuccess(tx)
            },
            onError: (err) => {
                console.log(err)
                handleClose()
                handleNewNotificationError()
                return
            },
        })
    }

    const handleSuccess = async (tx: any) => {
        const txReceipt = await tx.wait(1)

        handleNewNotification()

        set(refDb(database, `${chainId}/funds/${fundAddress}/milestones/${numberofMilestones}`), {
            name: name,
            description: description,
            duration: milestoneDuration,
        })

        updateMilestoneLength()
        props.onChangeState!()
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
            {isWeb3Enabled && fundAddress ? (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", margin: "20px" }}>
                    <Button className={styles.donateButton} style={{ width: "20%", marginLeft: "auto", marginRight: "auto", marginTop: "40px" }} onClick={() => { setOpen(true) }}>Add Milestone</Button>
                    <Modal
                        open={open}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        onClose={handleClose}>
                        <Box sx={modalStyle}>
                            <h1 className="text-4xl font-bold text-center text-slate-900">Add Another Milestone</h1>

                            <div style={{ width: "100%", alignContent: "center", alignItems: "center", paddingRight: "250px", paddingLeft: "250px" }}>
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
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                                            onClick={async function () {
                                                handleNewMilestone()
                                            }}
                                        >
                                            Add Milestone
                                        </button>
                                        <div style={{ fontStyle: "italic" }}><p>Disclaimer: Adding a milestone is a permanent change to the underlying contract.
                                            If planning on adding a milestone, it is recommended to do so prior to withdrawing your funds or you will have to &apos;withdraw&apos; twice to begin accepting donations again. More info in FAQ/help page.</p></div>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Modal>
                </div>
            ) : (
                <div>No Create Yield Address Detected</div>
            )}
        </div>
    )
}
