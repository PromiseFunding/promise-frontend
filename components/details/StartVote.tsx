import { useState, SetStateAction } from "react"
import { propType } from "../../config/types"
import styles from "../../styles/details/details.module.css"
import { abi } from "../../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Button from '@mui/material/Button';
import { ContractTransaction } from "ethers"
import { useNotification } from "web3uikit"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormHelperText from '@mui/material/FormHelperText'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField'

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

export default function StartVote(props: propType) {
    const fundAddress = props.fundAddress
    const owner = props.milestoneSummary!.owner

    const [open, setOpen] = useState(false)
    const [voteDuration, setVoteDuration] = useState("7")
    const dispatch = useNotification()


    const { runContractFunction: startVote } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "startVote",
        params: { length: Number(voteDuration) },
    })

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Vote Started!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleNewNotificationError = function () {
        dispatch({
            type: "info",
            message: "Vote Start Failed!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleSuccess = async function (tx: ContractTransaction) {
        try {
            await tx.wait(1)
            props.onChangeState!()
            handleNewNotification()
        } catch (error) {
            console.log(error)
            handleNewNotificationError()
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleChangeVoteDuration = (event: { target: { value: SetStateAction<string> } }) => {
        //max for now is 60 days
        const max = 14
        const min = 7
        let duration = "0"
        if ((event.target.value as unknown as number) > 0) {
            const value = Math.max(
                min,
                Math.min(max as number, Number(Number(event.target.value).toFixed(0)))
            )
            duration = value.toString()
        } else {
            duration = "7"
        }
        setVoteDuration(duration)
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
                        <h1 style={{ fontSize: "30px", fontWeight: "500", textAlign: "center" }}>Start Vote</h1>
                        <div style={{ textAlign: "center" }}>
                            <FontAwesomeIcon className={styles.donateIcon} icon={["fas", 'check-to-slot']} mask={["fas", "square-full"]} size="6x" transform="shrink-4" />
                        </div>
                        <FormHelperText style={{ textAlign: "center" }}>
                            {owner.toLowerCase() == props.userAddress!.toLowerCase() ? "When you believe you have accomplished the goals of the current milestone, you may begin the vote. Funders of your project will vote on whether they believe you lived up to your promises to decide whether you receive the money and the fundraiser will continue."
                                : "Since the milestone has ended, anyone may start the vote now. Funders of this project will be able to vote on whether they believe the owner lived up to their promises for this milestone to decide whether the owner will receive the money and the fundraiser will continue."}
                        </FormHelperText>
                        <TextField
                            type="number"
                            name="duration"
                            label="Vote Duration (days)"
                            variant="filled"
                            value={voteDuration}
                            onChange={(e) => {
                                handleChangeVoteDuration(e)
                            }}
                            style={{ width: "50%", marginTop: "30px" }}
                            helperText="Between 7-14 days."
                        ></TextField>
                        <div className={styles.buttons}>
                            <Button className={styles.donateButton2}
                                onClick={async function () {
                                    await startVote({
                                        onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                        onError: (error) => console.log(error),
                                    })
                                }}>
                                Start Vote
                            </Button>
                        </div>

                    </div>
                </Box>
            </Modal>
            <Button className={styles.donateButton}
                onClick={() => { setOpen(true) }}>
                Start Vote
            </Button>
        </div >
    )
}
