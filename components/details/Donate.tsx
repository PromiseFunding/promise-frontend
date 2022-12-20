import { useEffect, useState, SetStateAction } from "react"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { propType } from "../../config/types"
import { ref, get } from "firebase/database"
import { database } from "../../firebase-config"
import styles from "../../styles/details/details.module.css"
import { abi, erc20Abi } from "../../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import { TextField } from "@material-ui/core";
import { BigNumber } from 'ethers'
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.

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

export default function Donate(props: propType) {
    const fundAddress = props.fundAddress
    const tranche = props.tranche
    const milestoneDurations = props.milestoneDurations
    const decimals = props.decimals
    const coinName = props.coinName
    const userAddress = props.userAddress
    const state = props.currState!
    const totalRaised = props.totalRaised
    const owner = props.ownerFund
    const funderSummary = props.funderSummary
    const assetAddress = props.assetAddress

    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()


    const [open, setOpen] = useState(false)
    const [donateType, setDonateType] = useState("spread")
    const [amount, setAmount] = useState("0")
    const [amountFunded, setAmountFunded] = useState(0)
    const dispatch = useNotification()

    function handleChangeType(event: { target: { value: SetStateAction<string> } }) {
        setDonateType(event.target.value)
    }

    const handleChangeAmount = (event: { target: { value: SetStateAction<string> } }) => {
        //making the max donation 100,000,000 tokens at a time
        const max = 100000000
        //for now we are only allowing to two decimal places for deposits and withdraws
        if ((event.target.value as unknown as number) > 0) {
            const value = Math.max(
                1 * 10 ** -decimals!,
                Math.min(max as number, Number(Number(event.target.value).toFixed(decimals!)))
            )
            setAmount(value.toString())
        } else if ((event.target.value as unknown as number) < 0) {
            setAmount("0")
        } else {
            setAmount(event.target.value)
        }
    }

    const {
        runContractFunction: approve,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: erc20Abi,
        contractAddress: assetAddress!,
        functionName: "approve",
        params: {
            _spender: fundAddress,
            _value: BigNumber.from((Number(amount) * 10 ** decimals!).toString()),
        },
    })

    const { runContractFunction: fund } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "fund",
        params: { amount: BigNumber.from((Number(amount) * 10 ** decimals!).toString()), current: donateType == "direct" },
    })

    async function updateUI() {
        const amountFundedFromCall = funderSummary!.fundAmount.toNumber()
        setAmountFunded(amountFundedFromCall / 10 ** decimals!)
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
    }, [isWeb3Enabled, fundAddress, account, totalRaised])

    const handleClose = () => {
        setOpen(false)
    }

    const handleSuccess = async function () {
        const fundTx: any = await fund()
        setAmount("0")
        try {
            await fundTx.wait(1)
            handleNewNotification()
            props.onGetFunderInfo!(account!, tranche!)
        } catch (error) {
            console.log(error)
            handleNewNotificationError()
        }
        handleClose()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Donation Complete!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleNewNotificationError = function () {
        dispatch({
            type: "info",
            message: "Donation Failed!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    return (
        <div className={styles.buttons}>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClose={handleClose}
            >
                <Box sx={modalStyle}>
                    <div className={styles.donateForm}>
                        <div>
                            {state != 4 ? (
                                <FormControl variant="filled">
                                    <InputLabel>Donation Type</InputLabel>

                                    <Select
                                        value={donateType}
                                        label="Category"
                                        onChange={handleChangeType}
                                    >
                                        <MenuItem value={"spread"}>Spread</MenuItem>
                                        <MenuItem value={"direct"}>Direct</MenuItem>
                                    </Select>
                                    <div style={{ textAlign: "center" }}>
                                        <FontAwesomeIcon className={styles.donateIcon} icon={["fas", (donateType == "spread" ? "calendar-days" : "bullseye")]} mask={["fas", "square-full"]} size="6x" transform="shrink-4" />
                                    </div>
                                    <FormHelperText style={{ textAlign: "center" }}>{donateType == "spread" ? (<>A spread donation will divide the donation amount equally among the remaining milestone periods.</>) : (<>A direct donation donates only to the current milestone period.</>)}</FormHelperText>
                                </FormControl>
                            ) : (
                                <FormControl>
                                    <h1 style={{ fontSize: "30px", fontWeight: "500", textAlign: "center" }}>Seed Donation</h1>
                                    <div style={{ textAlign: "center" }}>
                                        <FontAwesomeIcon className={styles.donateIcon} icon={["fas", 'seedling']} mask={["fas", "square-full"]} size="6x" transform="shrink-4" />
                                    </div>
                                    <FormHelperText style={{ textAlign: "center" }}>The money raised in this round will go directly to the fundraiser to start them off before milestone funding begins.</FormHelperText>
                                </FormControl>
                            )}
                        </div>

                        <div style={{ width: "100%", textAlign: "center", }}>
                            <TextField
                                type="number"
                                name="duration"
                                label="Donation Amount"
                                variant="filled"
                                value={amount}
                                onChange={handleChangeAmount}
                                style={{ width: "50%", marginTop: "15px" }}
                            />
                        </div>

                        <Button className={styles.donateButton2} style={{ bottom: "0px" }} onClick={async function () {
                            await approve({
                                onSuccess: (tx) => handleSuccess(),
                                onError: (error) => console.log(error),
                            })
                        }}>Donate</Button>

                    </div>
                </Box>
            </Modal>

            <Button className={styles.shareButton}>Share</Button>
            <Button className={(((state == 0 || state == 4) && owner != account) ? styles.donateButton : styles.disabledButton)} disabled={(state < 4 && state > 0) || (owner == account)} onClick={(e) => { setOpen(true) }}>
                Donate
            </Button>
            <div className={styles.donateDisableTest} style={{ "--visibility": (state < 4 && state > 0 ? 'visible' : 'hidden'), "--position": (state < 4 && state > 0 ? 'relative' : 'absolute') } as React.CSSProperties}>
                * Donating only enabled during fundraising periods.
            </div>

            <div className={styles.donateDisableTest} style={{ "--visibility": (owner == account ? 'visible' : 'hidden'), "--position": (owner == account ? 'relative' : 'absolute') } as React.CSSProperties}>
                * Fundraiser owners may not donate to their own funds.
            </div>
        </div>
    )
}
