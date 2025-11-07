// Import Firebase SDK versi 10 (modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Konfigurasi Firebase dari console
const firebaseConfig = {
  apiKey: "AIzaSyDGuvC58Yy5gzsLfhwIclEDvpMoPFJVQaA",
  authDomain: "inputnilaimahasiswa-7642f.firebaseapp.com",
  projectId: "inputnilaimahasiswa-7642f",
  storageBucket: "inputnilaimahasiswa-7642f.firebasestorage.app",
  messagingSenderId: "1012228913985",
  appId: "1:1012228913985:web:9f58c0373de571fc9cbfc0",
  measurementId: "G-D0FC1K413M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export fungsi-fungsi yang diperlukan
export { db, collection, addDoc, getDocs, serverTimestamp };
