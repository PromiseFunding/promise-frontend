import { useEffect, useState, SetStateAction } from "react"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { propType } from "../../config/types"
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
import { BigNumber, ContractTransaction } from 'ethers'
import { useNotification } from "web3uikit"
import { update, set, ref as refDb, ref, onValue } from "firebase/database"
import { DEFAULT_CHAIN_ID } from "../../config/helper-config"


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
    const milestoneSummary = props.milestoneSummary
    const funderSummary = props.funderSummary
    const fundAddress = props.fundAddress
    const decimals = props.decimals
    const tranche = milestoneSummary!.currentTranche
    const state = milestoneSummary!.state
    const totalRaised = milestoneSummary!.lifeTimeRaised
    const owner = milestoneSummary!.owner
    const assetAddress = milestoneSummary!.assetAddress
    const timeLeftRound = milestoneSummary!.timeLeftRound.toNumber()

    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = chainIdHex ? parseInt(chainIdHex!).toString() : DEFAULT_CHAIN_ID


    const [open, setOpen] = useState(false)
    const [donateType, setDonateType] = useState("spread")
    const [amount, setAmount] = useState("0")
    const [userAddress, setUserAddress] = useState("0")
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
        if (account) {
            setUserAddress(account)
        }
    }, [isWeb3Enabled, fundAddress, account])

    const handleClose = () => {
        setOpen(false)
    }

    const disabled = (): boolean => {
        if ((state < 4 && state > 0) || (owner.toLowerCase() == userAddress.toLowerCase()) || (timeLeftRound == 0)) {
            return true
        }
        return false
    }

    const disabledMessage = (): string => {
        if (state < 4 && state > 0) {
            return "* Donating only enabled during fundraising periods."
        }
        if (owner.toLowerCase() == userAddress.toLowerCase()) {
            return "* Fundraiser owners may not donate to their own funds."
        }
        if (timeLeftRound == 0) {
            return "* The donating period has ended."
        }
        return "* Donating is currently disbled"
    }

    const handleSuccess = async function (tx: ContractTransaction) {
        await tx.wait(1)
        const fundTx: any = await fund()
        setAmount("0")
        try {
            await fundTx.wait(1)
            handleNewNotification()
            props.onGetFunderInfo!()
            var donorRef = ref(database, chainId + "/users/" + account + "/donor/" + fundAddress)

            onValue(donorRef, (snapshot) => {
                if (!snapshot.exists()) {
                    set(refDb(database, `${chainId}/users/${account}/donor/${fundAddress}`), {
                        fundAddress: fundAddress,
                    })
                }
            })
        } catch (error) {
            console.log(error)
            handleNewNotificationError()
        }
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
                            {state != 4 ? (
                                <div>
                                    <FormControl variant="filled" sx={{ backgroundColor: "rgb(241 245 249)", borderRadius: "10px", width: "100%" }}
                                    >
                                        <InputLabel>Donation Type</InputLabel>

                                        <Select
                                            value={donateType}
                                            label="Category"
                                            onChange={handleChangeType}

                                        >
                                            <MenuItem value={"spread"}>Spread</MenuItem>
                                            <MenuItem value={"direct"}>Direct</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <div style={{ textAlign: "center" }}>
                                            <FontAwesomeIcon className={styles.donateIcon} icon={["fas", (donateType == "spread" ? "calendar-days" : "bullseye")]} mask={["fas", "square-full"]} size="6x" transform="shrink-4" />
                                        </div>
                                        <FormHelperText style={{ textAlign: "center" }}>{donateType == "spread" ? (<>A spread donation will divide the donation amount equally among the remaining milestone periods.</>) : (<>A direct donation donates only to the current milestone period.</>)}</FormHelperText>
                                    </FormControl>
                                </div>
                            ) : (
                                <FormControl>
                                    <h1 style={{ fontSize: "30px", fontWeight: "500", textAlign: "center" }}>Seed Donation</h1>
                                    <div style={{ textAlign: "center" }}>
                                        <FontAwesomeIcon className={styles.donateIcon} icon={["fas", 'seedling']} mask={["fas", "square-full"]} size="5x" transform="shrink-4" />
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
                                style={{ width: "60%", marginTop: "15px", backgroundColor: "rgb(241 245 249)", borderRadius: "10px" }}
                            />
                        </div>

                        <Button className={styles.donateButton2} style={{ bottom: "0px" }} onClick={async function () {
                            handleClose()
                            await approve({
                                onSuccess: (tx) => handleSuccess(tx as ContractTransaction),
                                onError: (error) => console.log(error),
                            })
                        }}>Donate</Button>

                    </div>
                </Box>
            </Modal>

            <Button className={!disabled() ? styles.donateButton : styles.disabledButton} disabled={disabled()} onClick={(e) => { setOpen(true) }}>
                Donate
            </Button>

            {
                disabled() ? (
                    <div className={styles.disabledText} style={{ "--visibility": (disabled() ? 'visible' : 'hidden'), "--position": (disabled() ? 'relative' : 'absolute') } as React.CSSProperties}>
                        {disabledMessage()}
                    </div>) : (<div></div>)
            }
        </div >
    )
}
