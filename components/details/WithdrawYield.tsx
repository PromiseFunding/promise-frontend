import { SetStateAction, useEffect, useState } from "react"
import { propType } from "../../config/types"
import styles from "../../styles/details/details.module.css"
import { yieldAbi } from "../../constants"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Button from "@mui/material/Button"
import { BigNumber, ContractTransaction } from "ethers"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { TextField } from "@material-ui/core"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import FormHelperText from "@mui/material/FormHelperText"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { formatDuration, convertSeconds } from "../../utils/utils"

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "375px",
    height: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
    borderRadius: "25px",
}

export default function WithdrawYield(props: propType) {
    const fundAddress = props.fundAddress
    const fundSummary = props.fundSummary
    const owner = fundSummary!.owner
    const funderSummary = props.funderSummaryYield
    const decimals = props.decimals
    const coinName = props.coinName
    const entryTime = funderSummary!.entryTime

    const { account } = useMoralis()

    const [open, setOpen] = useState(false)
    const [userAddress, setUserAddress] = useState("")
    const [val, setVal] = useState("0")
    const [timeLeftFunder, settimeLeftFunder] = useState(0)

    useEffect(() => {
        if (account) {
            setUserAddress(account)
        }
        settimeLeftFunder(funderSummary!.timeLeftLock.toNumber())
    }, [account, entryTime])

    const dispatch = useNotification()

    const handleChangeAmount = async (event: { target: { value: SetStateAction<string> } }) => {
        const max = funderSummary!.amountWithdrawable.toNumber() / 10 ** decimals!
        if (max == 0) {
            setVal("0")
        } else if ((event.target.value as unknown as number) > 0) {
            const value = Math.max(
                1 * 10 ** -decimals!,
                Math.min(max as number, Number(Number(event.target.value).toFixed(decimals!)))
            )
            setVal(value.toString())
        } else if ((event.target.value as unknown as number) <= 0) {
            setVal("0")
        } else {
            setVal(event.target.value)
        }
    }

    const { runContractFunction: withdrawProceeds } = useWeb3Contract({
        abi: yieldAbi,
        contractAddress: fundAddress!,
        functionName: "withdrawProceeds",
        params: {},
    })

    const { runContractFunction: withdrawFundsFromPool } = useWeb3Contract({
        abi: yieldAbi,
        contractAddress: fundAddress!,
        functionName: "withdrawFundsFromPool",
        params: { amount: BigNumber.from((Number(val) * 10 ** decimals!).toString()) },
    })

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Withdraw Complete!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleNewNotificationError = function () {
        dispatch({
            type: "info",
            message: "Withdraw Failed!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleSuccess = async function (tx: ContractTransaction) {
        try {
            await tx.wait(1)
            props.onGetFunderInfo!()
            handleNewNotification()
        } catch (error) {
            console.log(error)
            handleNewNotificationError()
        }
    }

    const isDisabled = (): boolean => {
        if (
            userAddress != owner.toLowerCase() &&
            funderSummary!.amountWithdrawable.toNumber() == 0
        ) {
            return true
        }
        if (
            userAddress == owner.toLowerCase() &&
            fundSummary!.withdrawableInterestProceeds.toNumber() +
                fundSummary!.totalActiveFunded.toNumber() -
                fundSummary!.totalActiveInterestFunded.toNumber() ==
                0
        ) {
            return true
        }

        return false
    }

    const disabledMessage = (): string => {
        if (owner.toLowerCase() == userAddress.toLowerCase()) {
            return "* There are no funds for you to withdraw."
        }
        return "* There are no funds for you to withdraw from the interest donation method."
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            {userAddress == owner.toLowerCase() ? (
                <div>
                    <Button
                        disabled={isDisabled()}
                        className={isDisabled() ? styles.disabledButton : styles.donateButtonYield}
                        style={{ marginBottom: isDisabled() ? "0px" : "10px" }}
                        onClick={async function () {
                            await withdrawProceeds({
                                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Withdraw
                    </Button>
                    {isDisabled() ? (
                        <div
                            className={styles.disabledText}
                            style={
                                {
                                    "--visibility": isDisabled() ? "visible" : "hidden",
                                    "--position": isDisabled() ? "relative" : "absolute",
                                } as React.CSSProperties
                            }
                        >
                            {disabledMessage()}
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            ) : timeLeftFunder > 0 ? (
                <>
                    <div
                        className={styles.disabledText}
                        style={
                            {
                                "--visibility": "visible",
                                "--position": "relative",
                            } as React.CSSProperties
                        }
                    >
                        * The timelock is still going. You have {formatDuration(timeLeftFunder)}{" "}
                        seconds left before you can withdraw your deposit from the interest donation method.
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <Modal
                            open={open}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            onClose={handleClose}
                        >
                            <Box sx={modalStyle}>
                                <div className={styles.modalForm}>
                                    <div>
                                        <div>
                                            <FormHelperText
                                                style={{
                                                    textAlign: "center",
                                                    fontSize: "20px",
                                                    color: "black",
                                                }}
                                            >
                                                <>Interest Donor Withdraw</>
                                            </FormHelperText>
                                            <FormControl>
                                                <div style={{ textAlign: "center" }}>
                                                    <FontAwesomeIcon
                                                        className={styles.donateIconYield}
                                                        icon={["fas", "coins"]}
                                                        mask={["fas", "square-full"]}
                                                        size="6x"
                                                        transform="shrink-4"
                                                    />
                                                </div>
                                                <FormHelperText style={{ textAlign: "center" }}>
                                                    <>
                                                        You can withdraw up to{" "}
                                                        {funderSummary!.amountWithdrawable.toNumber() /
                                                            10 ** decimals!}{" "}
                                                        {coinName!}
                                                    </>
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    </div>
                                    <div style={{ width: "100%", textAlign: "center" }}>
                                        <TextField
                                            type="number"
                                            name="duration"
                                            label="Withdraw Amount"
                                            variant="filled"
                                            value={val}
                                            onChange={handleChangeAmount}
                                            style={{
                                                width: "60%",
                                                marginTop: "15px",
                                                backgroundColor: "rgb(241 245 249)",
                                                borderRadius: "10px",
                                            }}
                                        />
                                    </div>
                                    <Button
                                        className={styles.donateButtonYield2}
                                        style={{ bottom: "0px" }}
                                        onClick={async function () {
                                            handleClose()
                                            await withdrawFundsFromPool({
                                                onSuccess: (tx) =>
                                                    handleSuccess(tx as ContractTransaction),
                                                onError: (error) => console.log(error),
                                            })
                                        }}
                                    >
                                        Withdraw
                                    </Button>
                                </div>
                            </Box>
                        </Modal>
                    </div>
                    <div>
                        {isDisabled() ? (
                            <></>
                        ) : (
                            <Button
                                className={styles.donateButtonYield}
                                style={{ marginBottom: "10px" }}
                                onClick={async function () {
                                    setOpen(true)
                                }}
                            >
                                Withdraw
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
