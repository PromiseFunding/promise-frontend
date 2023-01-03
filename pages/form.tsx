import type { NextPage } from "next"
import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import NewFund from "../components/Newfund"
import InfoNewFund from "../components/InfoNewFund"
import Link from "next/link"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import Button from "@mui/material/Button"
import { SetStateAction, useState, useEffect } from "react"

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 3,
    height: "80vh",
    overflowY: "scroll", // Add overflow-y property
}

const Form: NextPage = () => {
    const [open, setOpen] = useState(true)
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    return (
        <div className={styles.container}>
            <Head>
                <title>Promise</title>
                <meta name="description" content="Version one of the FundMe Smart Contract" />
            </Head>
            <Header main={false}></Header>
            <div className="p-5 flex flex-col">
                <NewFund></NewFund>
                <Button className={styles.buttonStyle} onClick={handleOpen}>
                    Here for now to pop up info
                </Button>

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}><InfoNewFund></InfoNewFund></Box>
                </Modal>
            </div>
        </div>
    )
}

export default Form
