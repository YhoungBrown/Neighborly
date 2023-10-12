import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWZ0f39m5MeYzD5V9_c3L93G3FBmWmZqM",
  authDomain: "signal-c8eea.firebaseapp.com",
  projectId: "signal-c8eea",
  storageBucket: "signal-c8eea.appspot.com",
  messagingSenderId: "405108700997",
  appId: "1:405108700997:web:4f22a63005feb03e37302c"
};



// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {auth, db}