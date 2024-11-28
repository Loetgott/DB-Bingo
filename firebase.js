import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Firebase-Konfiguration
const firebaseConfig = {
  apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "db-bingo.firebaseapp.com",
  projectId: "db-bingo",
  storageBucket: "db-bingo.appspot.com",
  messagingSenderId: "37192930676",
  appId: "1:37192930676:web:2d95e07e1f0697b8594821",
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };