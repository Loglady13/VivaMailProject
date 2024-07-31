// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbIB7pnPPPRGS1o9K6-80vcOr-TWc8f2U",
  authDomain: "proyecto-software-bd18c.firebaseapp.com",
  projectId: "proyecto-software-bd18c",
  storageBucket: "proyecto-software-bd18c.appspot.com",
  messagingSenderId: "700109728234",
  appId: "1:700109728234:web:3736caf497619a1972ea93"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

export default appFirebase
