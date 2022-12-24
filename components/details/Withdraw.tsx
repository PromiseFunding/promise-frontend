import { useState } from "react"
import { propType } from "../../config/types"
import styles from "../../styles/details/details.module.css"
import { abi } from "../../constants"
import { useWeb3Contract } from "react-moralis"
import Button from '@mui/material/Button';
import { ContractTransaction } from "ethers"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.

export default function Withdraw(props: propType) {
    const fundAddress = props.fundAddress

    const [open, setOpen] = useState(false)
    const dispatch = useNotification()


    const { runContractFunction: withdrawProceeds } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "withdrawProceeds",
        params: {},
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
            props.onChangeState!()
            handleNewNotification()
        } catch (error) {
            console.log(error)
            handleNewNotificationError()
        }
    }

    return (
        <div>
            <Button className={styles.donateButton}
                onClick={async function () {
                    await withdrawProceeds({
                        onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                        onError: (error) => console.log(error),
                    })
                }}>
                Withdraw
            </Button>
        </div >
    )
}
