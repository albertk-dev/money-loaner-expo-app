// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEMrzua6093et5z0-rWcjJVaeMwL0iDms",
  authDomain: "ak-money-loaner.firebaseapp.com",
  projectId: "ak-money-loaner",
  storageBucket: "ak-money-loaner.appspot.com",
  messagingSenderId: "522942177378",
  appId: "1:522942177378:web:e2c4eb18381824865d713b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)