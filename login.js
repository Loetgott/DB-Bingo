// Your Firebase configuration and initialization here
const firebaseConfig = {
    apiKey: "REACT_APP_FIREBASE_API_KEY",
    authDomain: "db-bingo.firebaseapp.com",
    projectId: "db-bingo",
    storageBucket: "db-bingo.appspot.com",
    messagingSenderId: "37192930676",
    appId: "1:37192930676:web:2d95e07e1f0697b8594821",
  };
  
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('login-btn').addEventListener('click', function() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("Logged in as:", userCredential.user);
          document.getElementById('login-form').style.display = 'none';
        })
        .catch((error) => {
          console.error("Error: ", error.code, error.message);
        });
    });
  
    document.getElementById('signup-btn').addEventListener('click', function() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("Signed up as:", userCredential.user);
          document.getElementById('login-form').style.display = 'none';
        })
        .catch((error) => {
          console.error("Error: ", error.code, error.message);
        });
    });
  
    auth.onAuthStateChanged((user) => {
      if (user) {
        document.getElementById('login-form').style.display = 'none';
      } else {
        document.getElementById('login-form').style.display = 'block';
      }
    });
  });
  