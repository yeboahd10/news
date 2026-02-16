// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwMHk7ZEC20Si2-9pzBJBiHER21SLPUYw",
  authDomain: "echonews-e759c.firebaseapp.com",
  projectId: "echonews-e759c",
  storageBucket: "echonews-e759c.firebasestorage.app",
  messagingSenderId: "255878334642",
  appId: "1:255878334642:web:db168bc02120fc8cc8e1ab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firestore
export const db = getFirestore(app)