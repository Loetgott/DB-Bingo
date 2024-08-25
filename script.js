// script.js
import { db } from './firebase.js'; // Importiere db aus firebase.js
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

async function getDeviationField(devId) {
  console.log("suche nach Feld mit id " + devId + " ...");
  try {
    const docRef = doc(db, "deviations", "deviations");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Dokumentdaten:", docSnap.data());

      const fieldValue = docSnap.data()[devId];
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

window.loadTable = async function(){
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

import { Timestamp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

function saveData(playerId, fieldName, fieldValue) {
  console.log("Speicherung..." + playerId + " | " + fieldName + " | " + fieldValue);

  const docRef = doc(db, "player", String(playerId));

  return setDoc(docRef, {
    [fieldName]: String(fieldValue),
    timestamp: Timestamp.fromDate(new Date())
  }, { merge: true })
    .then(() => {
      console.log("Spielstand erfolgreich gespeichert!");
    })
    .catch((error) => {
      console.error("Fehler beim Speichern des Spielstands: ", error);
      throw error; // Fehler weiterreichen, um in handleLogin behandelt zu werden
    });
}


async function testFirestore() {
  try {
    const docRef = doc(db, "player", "testUser");
    await setDoc(docRef, { testField: "testValue" });
    console.log("Testdokument erfolgreich erstellt.");
  } catch (error) {
    console.error("Fehler beim Testen der Firestore-Verbindung: ", error);
  }
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

// Funktionen global verfügbar machen
window.setLoggedIn = setLoggedIn;
window.getLoggedIn = getLoggedIn;
window.setUserId = setUserId;
window.getUserId = getUserId;
window.saveData = saveData; // Wenn du saveData auch global benötigst