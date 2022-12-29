import { useEffect, useState } from "react"
import { propType } from "../../config/types"
import styles from "../../styles/details/details.module.css"
import { abi } from "../../constants"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Button from '@mui/material/Button';
import { ContractTransaction } from "ethers"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.

export default function WithdrawExpired(props: propType) {
    const fundAddress = props.fundAddress
    const milestoneSummary = props.milestoneSummary
    const owner = milestoneSummary!.owner
    const funderSummary = props.funderSummary
    const state = milestoneSummary!.state
    const tranche = milestoneSummary!.currentTranche

    const { account } = useMoralis()

    const [userAddress, setUserAddress] = useState("")

    useEffect(() => {
        if (account) {
            setUserAddress(account)
        }
    }, [account])

    const dispatch = useNotification()

    const { runContractFunction: ownerWithdrawPeriodExpired } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "ownerWithdrawPeriodExpired",
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
            props.onGetFunderInfo!()
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
                    await ownerWithdrawPeriodExpired({
                        onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                        onError: (error) => console.log(error),
                    })
                }}>
                End Fundraiser
            </Button>
        </div >
    )
}
