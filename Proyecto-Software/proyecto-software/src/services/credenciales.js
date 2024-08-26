import { initializeApp } from "firebase/app";
import {getStorage, ref,uploadBytes, getDownloadURL, getBytes } from 'firebase/storage';
import { getFirestore, collection, 
addDoc, getDocs, 
doc, getDoc,
query, where,
setDoc, deleteDoc} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);
export default appFirebase
