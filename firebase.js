import { initializeApp } from "firebase/app";
import  {getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBy9-SWyIN-aefYGLdNW4Gu4lBeM3I14L8",
  authDomain: "pantry-tracking-66f7a.firebaseapp.com",
  projectId: "pantry-tracking-66f7a",
  storageBucket: "pantry-tracking-66f7a.appspot.com",
  messagingSenderId: "1032545242911",
  appId: "1:1032545242911:web:8ed40d264f106663f02a2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};