import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZtjshmiuH_yOgw_yK6Y2au6KxLagUFac",
  authDomain: "tumani-parcels.firebaseapp.com",
  projectId: "tumani-parcels",
  storageBucket: "tumani-parcels.firebasestorage.app",
  messagingSenderId: "55078837688",
  appId: "1:55078837688:web:493625aef201c0732c434d",
  measurementId: "G-XTC2DKLER4"
};

// Initialize Firebase
const app = getApps().length === 0? initializeApp(firebaseConfig) : getApps()[0];

// Export what we need
export const db = getFirestore(app);
export const auth = getAuth(app);