import { SetStateAction, useEffect, useState } from "react"
import { propType } from "../../config/types"
import styles from "../../styles/details/details.module.css"
import { yieldAbi } from "../../constants"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Button from "@mui/material/Button"
import { BigNumber, ContractTransaction } from "ethers"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { TextField } from "@material-ui/core"

export default function WithdrawYield(props: propType) {
    const fundAddress = props.fundAddress
    const fundSummary = props.fundSummary
    const owner = fundSummary!.owner
    const funderSummary = props.funderSummaryYield
    const decimals = props.decimals

    const { account } = useMoralis()

    const [userAddress, setUserAddress] = useState("")
    const [val, setVal] = useState("0")

    useEffect(() => {
        if (account) {
            setUserAddress(account)
        }
    }, [account])

    const dispatch = useNotification()

    const handleChangeAmount = async (event: { target: { value: SetStateAction<string> } }) => {
        const max = funderSummary!.amountWithdrawable.toNumber() / 10 ** decimals!
        console.log(max)
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
        if (userAddress == owner.toLowerCase() && fundSummary!.totalActiveFunded.toNumber() == 0) {
            return true
        }

        return false
    }

    const disabledMessage = (): string => {
        if (owner.toLowerCase() == userAddress.toLowerCase()) {
            return "* There are no funds for you to withdraw."
        }
        return "* There are no funds from you to withdraw from the interest donation method."
    }

    return (
        <div>
            {userAddress == owner.toLowerCase() ? (
                <div>
                    <Button
                        disabled={isDisabled()}
                        className={isDisabled() ? styles.disabledButton : styles.donateButton}
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
                </div>
            ) : (
                <>
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
                    <br></br>
                    <div>
                        <Button
                            disabled={isDisabled()}
                            className={isDisabled() ? styles.disabledButton : styles.donateButton}
                            style={{ marginBottom: isDisabled() ? "0px" : "10px" }}
                            onClick={async function () {
                                await withdrawFundsFromPool({
                                    onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                    onError: (error) => console.log(error),
                                })
                            }}
                        >
                            Withdraw
                        </Button>
                    </div>
                </>
            )}
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
    )
}
