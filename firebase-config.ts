// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
// import { firebaseConfig } from './secrets/secrets'
import { getAuth, signInAnonymously } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASECONFIG_API_KEY?.toString(),
    authDomain: process.env.NEXT_PUBLIC_FIREBASECONFIG_AUTH_DOMAIN?.toString(),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASECONFIG_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASECONFIG_PROJECT_ID?.toString(),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASECONFIG_STORAGE_BUCKET?.toString(),
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASECONFIG_MESSAGING_SENDER_ID?.toString(),
    appId: process.env.NEXT_PUBLIC_FIREBASECONFIG_APP_ID?.toString(),
    measurementId: process.env.NEXT_PUBLIC_FIREBASECONFIG_MEASUREMENT_ID?.toString(),
}

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
