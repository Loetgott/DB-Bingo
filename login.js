// Firebase-Konfigurationsdaten einfügen
const firebaseConfig = {
  // ...
};
firebase.initializeApp(firebaseConfig);

// Anmeldeformular erstellen
const loginForm = document.getElementById('loginForm');

// Anmeldeformular-Ereignis behandeln
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // E-Mail und Passwort aus dem Formular abrufen
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  // Benutzer anmelden
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Benutzer erfolgreich angemeldet
      const user = userCredential.user;
      console.log('Benutzer angemeldet:', user);
    })
    .catch((error) => {
      // Fehler beim Anmelden
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Fehler beim Anmelden:', errorCode, errorMessage);
    });
});
