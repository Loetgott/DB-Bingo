// Deine Firebase Konfiguration und Initialisierung hier
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener("DOMContentLoaded", function () {
  // Event Listener für den Login Button
  document.getElementById('login-btn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Logged in as:", userCredential.user);
        // Zeige den Inhalt der Website an
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
      })
      .catch((error) => {
        console.error("Error: ", error.code, error.message);
      });
  });

  // Event Listener für den Sign-Up Button
  document.getElementById('signup-btn').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Signed up as:", userCredential.user);
        // Zeige den Inhalt der Website an
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
      })
      .catch((error) => {
        console.error("Error: ", error.code, error.message);
      });
  });

  // Überprüfe den Authentifizierungsstatus bei Seitenaufruf
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Benutzer ist eingeloggt, zeige den Inhalt an
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('main-content').style.display = 'block';
    } else {
      // Kein Benutzer eingeloggt, zeige das Login-Formular an
      document.getElementById('login-form').style.display = 'block';
      document.getElementById('main-content').style.display = 'none';
    }
  });
});
