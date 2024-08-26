// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

console.log(process.env.REACT_APP_FIREBASE_API_KEY);
apikey = process.env.REACT_APP_FIREBASE_API_KEY;

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: apikey,
  authDomain: "db-bingo.firebaseapp.com",
  projectId: "db-bingo",
  storageBucket: "db-bingo.appspot.com",
  messagingSenderId: "37192930676",
  appId: "1:37192930676:web:2d95e07e1f0697b8594821",
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
