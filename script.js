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
        
        if (await getData("player", getUserId(),"d" + i) === 'true') {
          // Hinzufügen des Kreuzes
          const cross = document.createElement('div');
          cross.classList.add('cross');
          cross.textContent = 'X';
          element.appendChild(cross);
          element.classList.add('marked');
        } else {
          // Entfernen des Kreuzes, falls vorhanden
          const cross = element.querySelector('.cross');
          if (cross) {
            element.removeChild(cross);
          }
          element.classList.remove('marked');
        }
      } catch (error) {
        console.error(`Fehler beim Abrufen des Werts für d${i}:`, error);
      }
    } else {
      console.warn(`Element mit ID d${i} nicht gefunden.`);
    }
  }
}

window.getData = async function(collection, documentName, fieldName) {
  console.log("suche nach Feld mit id " + fieldName + " ...");
  try {
    const docRef = doc(db, collection, documentName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Dokumentdaten:", docSnap.data());

      const fieldValue = docSnap.data()[fieldName];
      console.log(`Wert für ${fieldName}:`, fieldValue);
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

async function getAllDocuments(collectionName) {
  try {
      // Verweis auf die Sammlung erstellen
      const colRef = collection(db, collectionName);
      
      // Alle Dokumente aus der Sammlung abrufen
      const querySnapshot = await getDocs(colRef);
      
      // Array zum Speichern der Dokumentdaten
      const documents = [];
      
      // Durch die Dokumente iterieren und die Daten sammeln
      querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
  } catch (error) {
      console.error("Fehler beim Abrufen der Dokumente: ", error);
      throw error;
  }
}

// Globale Variable für die Benutzerdaten
let users = [];

// Funktion zum Hinzufügen eines Benutzers
function addUserToLeaderboard(username, points) {
  // Füge den neuen Benutzer zur Liste hinzu
  users.push({ username, points });

  // Sortiere die Benutzer nach Punkten in absteigender Reihenfolge
  users.sort((a, b) => b.points - a.points);

  // Hole den tbody-Teil der Tabelle
  const tableBody = document.querySelector('#leaderboard tbody');
  
  // Leere den aktuellen tbody-Inhalt
  tableBody.innerHTML = '';

  // Füge alle Benutzer zur Tabelle hinzu
  users.forEach((user, index) => {
    // Erstelle eine neue Zeile
    const newRow = document.createElement('tr');
    
    // Erstelle die Zellen für Rang, Benutzernamen und Punkte
    const rankCell = document.createElement('td');
    rankCell.textContent = index + 1; // Rang ist die Position + 1
    
    const usernameCell = document.createElement('td');
    usernameCell.textContent = user.username;
    
    const pointsCell = document.createElement('td');
    pointsCell.textContent = user.points;
    
    // Füge die Zellen zur Zeile hinzu
    newRow.appendChild(rankCell);
    newRow.appendChild(usernameCell);
    newRow.appendChild(pointsCell);
    
    // Füge die Zeile zum tbody hinzu
    tableBody.appendChild(newRow);
  });
}

// Beispielaufrufe der Funktion
//addUserToLeaderboard('neuerBenutzer1', 120);
//addUserToLeaderboard('neuerBenutzer2', 150);
//addUserToLeaderboard('neuerBenutzer3', 90);

window.loadLeaderboard = async function() {
  try {
      const documents = await getAllDocuments("player");

      for (let i = 0; i < documents.length; i++) {
          const doc = documents[i];
          const username = doc.name;
          const score = doc.score;

          addUserToLeaderboard(username, score);
      }
  } catch (error) {
      console.error("Fehler beim Laden des Leaderboards: ", error);
  }
}