import { contractAddresses, YieldFundFactory } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract } from "react-moralis"
import { SetStateAction, useEffect, useState } from "react"
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { tokenConfig } from "../config/token-config"
import { contractAddressesInterface } from "../config/types"
import { update, set, ref as refDb } from "firebase/database"
import { ref as refStore, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { database, storage } from "../firebase-config"
import { BigNumber } from "ethers"
import styles from "../styles/Home.module.css"
import TextField from "@mui/material/TextField"
import FormHelperText from "@mui/material/FormHelperText"
import FormControl from "@mui/material/FormControl"
import Box from "@mui/material/Box"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Image from "next/image"
import DeleteIcon from "@material-ui/icons/Delete"
import Modal from "@mui/material/Modal"
import CircularProgress from "@mui/material/CircularProgress"
import { useRouter } from "next/router"
import { DEFAULT_CHAIN_ID } from "../config/helper-config"

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "50%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
    borderRadius: "25px",
}

//contract is already deployed... trying to look at features of contract
export default function NewYieldFund() {
    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = chainIdHex ? parseInt(chainIdHex!).toString() : DEFAULT_CHAIN_ID


    const yieldAddress =
        chainId in addresses
            ? addresses[chainId]["FundFactory"][addresses[chainId]["FundFactory"].length - 1]
            : null
    const chainIdNum = parseInt(chainIdHex!)

    const [time, setTime] = useState("")
    const [assetValue, setAssetValue] = useState("USDT")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("--")
    const [assetAddress, setAssetAddress] = useState(
        chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].assetAddress : null
    )
    const [poolAddress, setPoolAddress] = useState("")
    const [aaveAddress, setAaveAddress] = useState("")
    const [decimalNumber, setDecimal] = useState(0)

    const [open, setOpen] = useState(false)
    const [done, setDone] = useState(false)

    const [file, setFile] = useState<File>()

    const dispatch = useNotification()
    const router = useRouter()

    const {
        runContractFunction: createYieldFundAAVE,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: YieldFundFactory,
        contractAddress: yieldAddress!,
        functionName: "createYieldFundAAVE",
        params: {
            lockTime: time,
            assetAddress: assetAddress,
            aaveTokenAddress: aaveAddress,
            poolAddress: poolAddress,
        },
    })

    function timeout(delay: number) {
        return new Promise((res) => setTimeout(res, delay))
    }

    useEffect(() => {
        if (isWeb3Enabled && yieldAddress) {
            handleChangeDetails()
        }
    }, [assetValue, isWeb3Enabled])

    const handleChangeAsset = (event: any) => {
        setAssetValue(event.target.value)
    }

    const handleNewFundraiser = async () => {
        if (category == "--" || !description || !assetValue || !time || !file) {
            handleGenericAlert("Please fill in the required fields.")
            return
        }

        const createTx: any = await createYieldFundAAVE({
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
        setOpen(true)
        const txReceipt = await tx.wait(1)

        handleNewNotification()

        const fundAddress = txReceipt.events[2].args.fundAddress
        setDone(true)

        const iconRef = refStore(
            storage,
            `/files/${chainId}/${fundAddress}/${crypto.randomUUID()}${file!.name}`
        )
        const uploadTask = uploadBytesResumable(iconRef, file as Blob)
        uploadTask.on(
            "state_changed",
            (snapshot) => { },
            (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    set(refDb(database, `${chainId}/funds/${fundAddress}`), {
                        fundTitle: title,
                        imageURL: url,
                        description: description,
                        category: category,
                        locktime: time,
                        asset: assetValue,
                        type: "Yield Fund",
                    })
                })
                set(refDb(database, `${chainId}/users/${account}/owner/${fundAddress}`), {
                    fundAddress: fundAddress,
                    type: "Yield Fund",
                })
            }
        )

        await timeout(1000) //for 1 sec delay

        // router.push(`/details/?fund=${fundAddress}`)
        router.push(`/discover`)
    }

    const handleChangeDetails = () => {
        const tokenAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].assetAddress : null
        const poolAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].poolAddress : null
        const aaveAddress =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].aaveTokenAddress : null
        const decimal =
            chainId in tokenConfig ? tokenConfig[chainIdNum][assetValue].decimals : null

        setDecimal(decimal!)
        setAssetAddress(tokenAddress!)
        setPoolAddress(poolAddress!)
        setAaveAddress(aaveAddress!)
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Fund Creation Complete!",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const handleNewNotificationError = function () {
        dispatch({
            type: "info",
            message: "Fund Creation Failed",
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

    function handleChangeImage(event: { target: { files: SetStateAction<any> } }) {
        setFile(event.target.files[0])
    }

    function handleChangeTitle(event: { target: { value: SetStateAction<string> } }) {
        setTitle(event.target.value)
    }

    function handleChangeDescription(event: { target: { value: SetStateAction<string> } }) {
        setDescription(event.target.value)
    }

    function handleChangeCategory(event: { target: { value: SetStateAction<string> } }) {
        setCategory(event.target.value)
    }

    const handleChangeLockTime = (event: { target: { value: SetStateAction<string> } }) => {
        //max for now is 20 years
        const max = 630720000
        if ((event.target.value as unknown as number) > 0) {
            const value = Math.max(
                0,
                Math.min(max as number, Number(Number(event.target.value).toFixed(0)))
            )
            setTime(value.toString())
        } else {
            setTime("0")
        }
    }

    return (
        <div className={styles.newFund}>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    {!done ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                alignItems: "center",
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: "50px",
                                    textAlign: "center",
                                    fontWeight: "700",
                                }}
                            >
                                New Fundraiser Loading...
                            </h1>
                            <Box
                                style={{
                                    display: "flex",
                                    width: "300px",
                                    height: "300px",
                                    justifyContent: "center",
                                }}
                            >
                                <CircularProgress style={{ marginTop: "50px" }} size={150} />
                            </Box>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                alignItems: "center",
                                zIndex: "25",
                            }}
                        >
                            <h1
                                style={{
                                    fontSize: "50px",
                                    textAlign: "center",
                                    fontWeight: "700",
                                }}
                            >
                                Fundraiser Created!
                            </h1>

                            <svg className={styles.animatedCheck} viewBox="0 0 24 24">
                                <path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" />
                            </svg>
                        </div>
                    )}
                </Box>
            </Modal>
            {isWeb3Enabled && yieldAddress ? (
                <Box>
                    <div className={styles.newFundFormYield}>
                        <div className={styles.formSectionOuterYield}>
                            <div className={styles.formSection}>
                                <TextField
                                    id="outlined-basic"
                                    label="Fund Title"
                                    variant="filled"
                                    onChange={handleChangeTitle}
                                    value={title}
                                    style={{ width: "30%" }}
                                    helperText="Input a title for your fund"
                                />
                                <FormControl variant="filled" style={{ width: "20%" }}>
                                    <InputLabel>Category</InputLabel>

                                    <Select
                                        value={category}
                                        label="Category"
                                        onChange={handleChangeCategory}
                                    >
                                        <MenuItem value="--">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={"Tech"}>Tech</MenuItem>
                                        <MenuItem value={"Film"}>Film</MenuItem>
                                        <MenuItem value={"Product"}>Product</MenuItem>
                                        <MenuItem value={"Gaming"}>Gaming</MenuItem>
                                    </Select>
                                    <FormHelperText>Select Category</FormHelperText>
                                </FormControl>
                                <FormControl variant="filled" style={{ width: "20%" }}>
                                    <InputLabel>Asset</InputLabel>
                                    <Select
                                        value={assetValue}
                                        label="Category"
                                        onChange={handleChangeAsset}
                                    >
                                        <MenuItem value={"USDC"}>USDC</MenuItem>
                                        <MenuItem value={"USDT"}>USDT</MenuItem>
                                        <MenuItem value={"DAI"}>DAI</MenuItem>
                                        <MenuItem value={"WETH"}>WETH</MenuItem>
                                    </Select>
                                    <FormHelperText>Fund&apos;s accepted asset</FormHelperText>
                                </FormControl>
                                <TextField
                                    type="number"
                                    name="duration"
                                    label="Enter Lock Time (seconds)"
                                    variant="filled"
                                    value={time}
                                    onChange={(e) => {
                                        handleChangeLockTime(e)
                                    }}
                                    style={{ width: "30%" }}
                                    helperText="Duration of Lock Time"
                                />
                            </div>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Project Description"
                                multiline
                                rows={10}
                                onChange={handleChangeDescription}
                                style={{ paddingBottom: "20px" }}
                                variant="filled"
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                alignContent: "center",
                                gap: "50px",
                            }}
                        >
                            <div style={{ display: "flex", gap: "20px", paddingTop: "20px" }}>
                                <h1 style={{ fontSize: "26px", paddingLeft: "80px" }}>
                                    Select an Image:
                                </h1>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    style={{ paddingTop: "7px" }}
                                />
                            </div>
                            {file ? (
                                <div>
                                    <Image
                                        src={URL.createObjectURL(file)}
                                        alt="Fund Picture"
                                        width={500}
                                        height={500}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <Image
                                        src={"/icons/image-preview.png"}
                                        alt="Fund Picture"
                                        width={500}
                                        height={500}
                                    />
                                </div>
                            )}

                            <button
                                className={styles.newFundButton}
                                style={{
                                    display: "flex",
                                    margin: "auto",
                                }}
                                onClick={async function () {
                                    handleNewFundraiser()
                                }}
                            >
                                <div>Create Yield Fund</div>
                            </button>
                        </div>
                    </div>
                </Box>
            ) : (
                <div>No Create Yield Address Detected</div>
            )}
        </div>
    )
}
