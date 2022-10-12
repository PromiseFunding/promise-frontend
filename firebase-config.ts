// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBFjz1F_bZxw3cjjgRl6tkrfujEHDtfz4s",
    authDomain: "yieldme.firebaseapp.com",
    databaseURL: "https://yieldme-default-rtdb.firebaseio.com",
    projectId: "yieldme",
    storageBucket: "yieldme.appspot.com",
    messagingSenderId: "814228495889",
    appId: "1:814228495889:web:fa81b23902ee34f1b7dbb0",
    measurementId: "G-HF1MR0ST6F",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
