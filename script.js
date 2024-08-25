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

function saveData(playerId, fieldName, fieldValue) {
  console.log("Speicherunng...");
  const docRef = db.collection("player").doc(String(playerId));

  docRef.set({
    [fieldName] : fieldValue,
    timestamp: new Date()
  }, { merge: true })  // Merge Option hinzugefügt, um bestehende Daten nicht zu überschreiben
    .then(() => {
      console.log("Spielstand erfolgreich gespeichert!");
    })
    .catch((error) => {
      console.error("Fehler beim Speichern des Spielstands: ", error);
    });
}

let currentUserUID = null;
let loggedIn = false;

function setLoggedIn(nLoggedIn) {
  localStorage.setItem('loggedIn', nLoggedIn);
}

function getLoggedIn() {
  return localStorage.getItem('loggedIn') === 'true';
}

function setUserId(nUserId) {
  localStorage.setItem('currentUserUID', nUserId);
}

function getUserId() {
  return localStorage.getItem('currentUserUID');
}
