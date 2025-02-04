// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5TebHwDXJP2ZUg4DGAtzhOUIQ6cr81AE",
  authDomain: "milan-ea9f9.firebaseapp.com",
  databaseURL: "https://milan-ea9f9-default-rtdb.firebaseio.com",
  projectId: "milan-ea9f9",
  storageBucket: "milan-ea9f9.firebasestorage.app",
  messagingSenderId: "924063641471",
  appId: "1:924063641471:web:e1ed992af72dc9465c344a",
  measurementId: "G-869XSMQ69P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const db = getDatabase(app);

export {db}
