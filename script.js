async function getDeviationField(devId) {
  console.log("suche nach Feld mit id " + devId + " ...")
  try {
    // Zugriff auf das Dokument in der Sammlung "deviations"
    const doc = await db.collection("deviations").doc("deviations").get();

    if (doc.exists) {
      console.log("Dokumentdaten:", doc.data());

      // Zugriff auf das Feld "d1"
      const fieldValue = doc.data()[devId];
      console.log(`Wert für ${devId}:`, fieldValue);
      return fieldValue;
    } else {
      console.log("Kein Dokument mit dieser ID gefunden.");
      return "Keine Daten";
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Abweichung:", error);
    return "Fehler";
  }
}

async function loadTable() {
  //registrateUser("nnamlohl@gmail.com","test");
  for (let i = 1; i < 26; i++) {
    const element = document.getElementById("d" + i);

    if (element) {
      try {
        const value = await getDeviationField("d" + i);
        element.textContent = value;
      } catch (error) {
        console.error(`Fehler beim Abrufen des Werts für d${i}:`, error);
      }
    } else {
      console.warn(`Element mit ID d${i} nicht gefunden.`);
    }
  }
}

// Spielstand speichern
function saveGameScore(playerId, score) {
  // Sicherstellen, dass playerId ein String ist
  const docRef = db.collection("scores").doc(String(playerId));

  docRef.set({
    score: score,
    timestamp: new Date()
  })
    .then(() => {
      console.log("Spielstand erfolgreich gespeichert!");
    })
    .catch((error) => {
      console.error("Fehler beim Speichern des Spielstands: ", error);
    });
}

let currentUserUID = null;
let loggedIn = false;

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (email && password) {
    const auth = getAuth(app);

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user
      loggedIn = true;
      currentUserUID = user.uid;
      console.log('User created:', user);
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        console.error("E-Mail-Adresse ist bereits registriert.");
        singIn(email,password);
      } else {
        console.error("Fehler:", error.code, error.message);
      }
    });
  } else {
      document.getElementById('error-message').textContent = 'Bitte alle Felder ausfüllen!';
  }
}

function registrateUser(email,password){
  const auth = getAuth(app);

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      currentUserUID = user.uid;
      window.location.href = '/table/table.html';
      console.log('User created:', user);
    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        console.error("E-Mail-Adresse ist bereits registriert.");
        singIn(email,password);
      } else {
        console.error("Fehler:", error.code, error.message);
      }
    });
}

function singIn(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {   
      const user = userCredential.user;
      currentUserUID = user.uid;
      loggedIn = true;
      window.location.href = '/table/table.html';
      console.log('Benutzer angemeldet:', user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Fehler beim Anmelden:', errorCode, errorMessage);
    });
}

function isLoggedIn() {
  return currentUserUID !== null;
}