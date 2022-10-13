// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { firebaseConfig } from "./secrets/secrets"
import { getAuth, signInAnonymously } from "firebase/auth"
import { getStorage } from "firebase/storage"

export const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)
export const storage = getStorage(app)
const auth = getAuth(app)
signInAnonymously(auth)
    .then(() => {})
    .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
    })
