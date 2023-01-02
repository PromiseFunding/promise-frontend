import { SetStateAction, useState, useEffect } from 'react'
import { set, ref as refDb, push, onValue } from "firebase/database"
import { ref as refStore, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { database, storage } from "../../firebase-config"
import { propType, update } from '../../config/types'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Image from 'next/image'
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from "../../styles/Home.module.css"
import { useMoralis } from 'react-moralis'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { useNotification } from "web3uikit" //wrapped components in this as well in _app.js.
import { formatDuration } from '../../utils/utils'

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3,
}

export default function Updates(props: propType) {
    const owner = props.ownerFund
    const fundAddress = props.fundAddress
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("")
    const [file, setFile] = useState<File>()
    const [uploading, setUploading] = useState(false)
    const [updates, setUpdates] = useState<update[]>()

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()
    const fundRef = refDb(database, chainId + "/funds/" + fundAddress + '/updates')

    useEffect(() => {
        onValue(fundRef, (snapshot) => {
            let updatesRaw: update[] = []
            for (const update in snapshot.val()) {
                updatesRaw.unshift(snapshot.val()[update])
            }
            setUpdates(updatesRaw)
        })
    }, [])

    const dispatch = useNotification()

    const [expanded, setExpanded] = useState<string | false>(false);

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
        setUploading(false)
    }
    const handleClose = () => {
        setOpen(false)
        setSubject("")
        setDescription("")
    }

    const handleSave = () => {
        setUploading(true)

        if (file) {
            const iconRef = refStore(storage, `/files/${chainId}/${fundAddress}/${crypto.randomUUID()}${file!.name}`)
            const uploadTask = uploadBytesResumable(iconRef, file as Blob)

            uploadTask.on(
                "state_changed",
                (snapshot) => { },
                (err) => console.log(err),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        push(refDb(database, `${chainId}/funds/${fundAddress}/updates`), {
                            subject: subject,
                            description: description,
                            imageUrl: url,
                            timestamp: Date.now()
                        })
                    })
                }
            )
        } else {
            push(refDb(database, `${chainId}/funds/${fundAddress}/updates`), {
                subject: subject,
                description: description,
                imageUrl: "",
                timestamp: Date.now()
            })
        }
        handleClose()
        handleNewNotification()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Update Upload Complete!",
            title: "Upload Notification",
            position: "topR",
        })
    }

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    function handleChangeDescription(event: { target: { value: SetStateAction<string> } }) {
        setDescription(event.target.value)
    }
    function handleChangeSubject(event: { target: { value: SetStateAction<string> } }) {
        setSubject(event.target.value)
    }

    function handleChangeImage(event: { target: { files: SetStateAction<any> } }) {
        setFile(event.target.files[0])
    }

    return (
        <div className={styles.updates}>
            <div className={styles.updatesList}>
                <h1 style={{ fontWeight: "700", fontSize: "50px" }}>Updates from the Owner</h1>

                {updates && updates.length > 0 ? (<div>
                    <h1 style={{ fontSize: "20px", marginBottom: "10px" }}>Periodically, the owner of the fund will update their funders on the progress of their fundraiser. They can share exciting developments, news, and updated timelines here!</h1>

                    {updates!.map((updateVal: update, index: number) => (
                        // <div key={index}>{update.description}</div>
                        <Accordion key={index} expanded={expanded === index.toString()} onChange={handleChange(index.toString())}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                                sx={{ backgroundColor: "white" }}
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    {updateVal.subject.toString()}
                                </Typography>
                                <Typography sx={{ color: 'text.secondary' }}>{formatDuration(Date.now() - (updateVal.timestamp as unknown as number))} ago</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {updateVal.description.toString()}
                                </Typography>
                                {updateVal.imageUrl ? (<div style={{ width: '100%', height: "500px", position: 'relative' }}>
                                    <Image
                                        alt='Update image'
                                        src={updateVal.imageUrl as unknown as string}
                                        layout='fill'
                                        objectFit='contain'
                                    />
                                </div>) : (<></>)}

                            </AccordionDetails>
                        </Accordion>
                    ))}

                </div>) : (<div>The Owner has not made any updates yet.</div>)}

                {account == owner ? (
                    <div className={styles.newUpdate}>
                        <Button className={styles.buttonStyle} onClick={handleOpen}>Add a new update</Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={modalStyle}>
                                <div className={styles.modalMain}>
                                    <h1 style={{ fontWeight: "700", fontSize: "50px" }}>Create a new update</h1>
                                    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                                        <TextField required
                                            label="Subject"
                                            variant="filled"
                                            onChange={handleChangeSubject}
                                            value={subject}
                                            helperText="Input a subject for your update. Be sure to include what milestone it applies to."
                                            style={{ width: "25%" }}
                                        />
                                        <h1 style={{ paddingTop: "12px", fontSize: "15px" }}>Add An Image: </h1>
                                        <input type="file" accept="image/*" onChange={handleChangeImage} style={{ paddingTop: "12px" }} />
                                    </div>
                                    <TextField required
                                        label="Description"
                                        multiline
                                        rows={10}
                                        onChange={handleChangeDescription}
                                        helperText="Add a description for the update. Be specific with what exactly you have done."
                                        style={{ paddingBottom: "20px", marginTop: "10px" }}
                                        variant="filled"
                                    />
                                    <div style={{ display: "flex", flexDirection: "row", width: "20vw", marginLeft: "auto" }}>
                                        <Button className={styles.buttonStyle} onClick={handleClose} style={{ ['--override-color' as any]: "red" }}>Cancel</Button>
                                        <Button className={styles.buttonStyle} disabled={!(subject && description) || uploading} onClick={handleSave} style={{ ['--override-color' as any]: (subject && description ? "blue" : "grey") }}>Save Update</Button>
                                    </div>


                                </div>

                            </Box>
                        </Modal>
                    </div >) : (<></>)
                }



            </div>
        </div >
    )
}
