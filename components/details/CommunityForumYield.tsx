import { useMoralis, useWeb3Contract } from 'react-moralis'
import { SetStateAction, useState, useEffect } from 'react'
import { abi } from "../../constants"
import styles from "../../styles/details/details.module.css"
import { BigNumber } from "ethers"
import { set, ref as refDb, push, onValue, update } from "firebase/database"
import { ref as refStore, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { database, storage } from "../../firebase-config"
import { Button, TextField } from '@mui/material'
import { useNotification } from "web3uikit"
import Link from 'next/link'
import { funderSummaryYield, fundSummary, propType } from "../../config/types"


export default function CommunityForumYield(props: propType) {
    const fundAddress = props.fundAddress
    const fundSummary = props.fundSummary as fundSummary
    const funderSummary = props.funderSummaryYield as funderSummaryYield
    const owner = fundSummary.owner!

    const { account, chainId: chainIdHex, } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    const [isFunder, setIsFunder] = useState(false)
    const [userAddress, setUserAddress] = useState("")
    const [forumLink, setForumLink] = useState("")
    const [link, setLink] = useState("")

    const dispatch = useNotification()

    const fundRef = refDb(database, chainId + "/funds/" + fundAddress + '/forumLink')

    const handleSave = () => {
        const fundRef = refDb(database, chainId + "/funds/" + fundAddress)

        update(fundRef, {
            "forumLink": link
        })

        handleNewNotification()
    }

    useEffect(() => {
        setIsFunder(funderSummary.amountTotal.toNumber() > 0)
        if (account) {
            setUserAddress(account)
        }
        onValue(fundRef, (snapshot) => {
            setForumLink(snapshot.val())
        })

    }, [funderSummary, fundAddress, account])

    function handleChangeLink(event: { target: { value: SetStateAction<string> } }) {
        setLink(event.target.value)
    }

    const isDisabled = (): boolean => {
        return link == ""
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Forum Link Set!",
            title: "Upload Notification",
            position: "topR",
        })
    }

    return (
        <div style={{ marginLeft: "25%", marginRight: "25%" }}>
            <h1 style={{ fontSize: "40px", fontWeight: "500", textAlign: "center", padding: "30px" }}>Connect</h1>
            <p style={{ textAlign: "center", marginBottom: "20px" }}>Creators have the option to share a communal space for the funders of their project to talk, discuss updates, and communicate with then creator. </p>
            {
                owner.toLowerCase() != account ? (<div>
                    {
                        isFunder ? (
                            <div>
                                {forumLink ? (
                                    <div style={{ textAlign: "center" }}>
                                        <div className={styles.forumLink}>
                                            <a href={forumLink}>Forum Link</a>
                                        </div>
                                        <h1>Click the link above to connect now!</h1>
                                    </div>
                                ) : (
                                    <h1 style={{ textAlign: "center", fontSize: "20px", fontWeight: "700" }}>The creator has not yet set a forum link.</h1>
                                )}
                            </div >
                        ) : (<h1 style={{ fontWeight: 700, textAlign: "center" }}>Only funders of this project may view the community forum.</h1>)
                    }
                </div>) : (
                    <div style={{ marginTop: "50px", marginLeft: "15%", marginRight: "15%" }}>
                        {!forumLink ? (
                            <div  >
                                <h1 style={{ textAlign: "center", fontSize: "20px", fontWeight: "700" }}>Set Forum Link</h1>
                                <p style={{ textAlign: "center" }}>For you to engage with your funders, it is highly recommended that you create some sort of forum for discussion (ie: Discord, Telegram, Signal)</p>
                            </div>
                        ) : (
                            <div style={{ textAlign: "center" }}>
                                <div className={styles.forumLink}>
                                    <a href={forumLink}>Forum Link</a>
                                </div>
                                <h1 style={{ textAlign: "center", fontSize: "20px", fontWeight: "700" }}>Update Forum Link</h1>
                                <p style={{ textAlign: "center" }}>You may update the forum link if you wish to a new forum you have created.</p>
                            </div>
                        )}
                        <TextField required
                            label="Forum Link"
                            variant="filled"
                            onChange={handleChangeLink}
                            value={link}
                            helperText="Input a link to the forum you have created."
                            style={{ width: "100%", marginTop: "30px" }}
                        />
                        <Button onClick={handleSave} className={isDisabled() ? styles.disabledButton : styles.donateButton} disabled={isDisabled()} style={{ marginTop: "20px" }}>Set Link</Button>

                    </div>
                )
            }
        </div >)
}
