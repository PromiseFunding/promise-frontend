import { useState, useEffect, SetStateAction } from "react"
import { propType } from "../../config/types"
import styles from "../../styles/details/details.module.css"
import { abi } from "../../constants"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Button from '@mui/material/Button';
import { ContractTransaction } from "ethers"
import { useNotification } from "web3uikit"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormControl, InputLabel, Select, MenuItem, TextField, Box, Modal, FormHelperText } from "@mui/material"

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "375px",
    height: "80%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: "25px"
}

export default function Vote(props: propType) {
    const fundAddress = props.fundAddress
    const funderSummary = props.funderSummary
    const milestoneSummary = props.milestoneSummary
    const tranche = milestoneSummary!.currentTranche

    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()

    const [open, setOpen] = useState(false)
    const [didFunderVote, setFunderVote] = useState(false)
    const [isFunder, setIsFunder] = useState(false)
    const [voteVal, setVoteVal] = useState("yes")

    const dispatch = useNotification()

    function updateUI() {
        const funderVoteFromCall = funderSummary!.didFunderVote
        const funderTrancheAmountRaised = funderSummary!.funderTrancheAmountRaised.toNumber()

        setFunderVote(funderVoteFromCall)
        setIsFunder(funderTrancheAmountRaised > 0)
    }

    useEffect(() => {
        if (funderSummary) {
            updateUI()
        }
    }, [funderSummary])

    useEffect(() => {
        if (isWeb3Enabled && fundAddress) {
            props.onGetFunderInfo!(account!, tranche!)
        }
    }, [isWeb3Enabled, fundAddress, account])

    const handleClose = () => {
        setOpen(false)
    }

    const isDisabled = (): boolean => {
        if (funderSummary!.didFunderVote) {
            return true
        }
        if (!isFunder) {
            return true
        }
        return false
    }

    const disabledText = (): string => {
        if (!isFunder) {
            return "* Only funders of the current milestone may vote."
        }
        if (funderSummary!.didFunderVote) {
            return "* You have already voted"
        }
        return "* Voting disabled"
    }

    const { runContractFunction: submitVote } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "submitVote",
        params: { support: voteVal == "yes" ? true : false },
    })

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Vote Submitted!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleNewNotificationError = function () {
        dispatch({
            type: "info",
            message: "Vote Failed!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleSuccess = async function (tx: ContractTransaction) {
        try {
            await tx.wait(1)
            props.onGetFunderInfo!(account!, tranche!)
            handleNewNotification()
        } catch (error) {
            console.log(error)
            handleNewNotificationError()
        }
    }

    function handleChangeVote(event: { target: { value: SetStateAction<string> } }) {
        setVoteVal(event.target.value)
    }

    return (
        <div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClose={handleClose}
            >
                <Box sx={modalStyle}>
                    <div className={styles.modalForm}>
                        <h1 style={{ fontSize: "30px", fontWeight: "500", textAlign: "center" }}>Vote</h1>
                        <div style={{ textAlign: "center" }}>
                            <FontAwesomeIcon className={styles.donateIcon} icon={["fas", 'check-to-slot']} mask={["fas", "square-full"]} size="6x" transform="shrink-4" />
                        </div>
                        <FormHelperText style={{ textAlign: "center" }}>
                            Funders of this project may now vote on whether they believe the fundraiser lived up to its promises. Please review the promises in the milestones section as well as the updates made by the fundraiser owner.
                        </FormHelperText>
                        <FormControl sx={{ marginTop: "20px", width: "80%", alignItems: "center" }}>
                            <h1 style={{ fontSize: "15px", fontWeight: "500", textAlign: "center" }}>Did the fundraiser keep their promises for this milestone?</h1>
                            <Select
                                value={voteVal}
                                onChange={handleChangeVote}
                                sx={{ color: "black", marginTop: "10px", textAlign: "center", width: "50%" }}
                            >
                                <MenuItem value={"yes"}>Yes</MenuItem>
                                <MenuItem value={"no"}>No</MenuItem>
                            </Select>
                        </FormControl>


                        <div className={styles.buttons}>

                            <Button className={isDisabled() ? styles.disabledButton : styles.donateButton2} disabled={isDisabled()}
                                onClick={async function () {
                                    await submitVote({
                                        onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                        onError: (error) => console.log(error),
                                    })
                                }}>
                                Submit Vote
                            </Button>
                            {isDisabled() ? (<h1 className={styles.disabledText}>{disabledText()}</h1>) : (<></>)}
                        </div>

                    </div>
                </Box>
            </Modal>
            <Button className={styles.donateButton}
                onClick={() => { setOpen(true) }}>
                Vote
            </Button>
        </div >
    )
}
