// script.js
import { db } from './firebase.js'; // Importiere db aus firebase.js
import { doc, setDoc, getDoc, collection, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

async function getDeviationField(devId) {
    console.log("suche nach Feld mit id " + devId + " ...");
    try {
        const docRef = doc(db, "deviations", "deviations");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
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

window.loadTable = async function () {
    for (let i = 1; i < 26; i++) {
        const element = document.getElementById("d" + i);
        if (element) {
            try {
                const value = await getDeviationField("d" + i);
                element.textContent = value;

                if (await getData("player", getUserId(), "d" + i) === 'true') {
                    const cross = document.createElement('div');
                    cross.classList.add('cross');
                    cross.textContent = 'X';
                    element.appendChild(cross);
                    element.classList.add('marked');
                } else {
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
};

window.getData = async function (collection, documentName, fieldName) {
    try {
        const docRef = doc(db, collection, documentName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const fieldValue = docSnap.data()[fieldName];
            return fieldValue;
        } else {
            console.log("Kein Dokument mit dieser ID gefunden.");
            return "Keine Daten";
        }
    } catch (error) {
        console.error("Fehler beim Abrufen der Abweichung:", error);
        return "Fehler";
    }
};

function saveData(playerId, fieldName, fieldValue) {
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
            throw error;
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
window.saveData = saveData;

// Dokumente abrufen
async function getAllDocuments(collectionName) {
    try {
        const colRef = collection(db, collectionName);
        const querySnapshot = await getDocs(colRef);
        const documents = [];

        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });

        return documents;
    } catch (error) {
        console.error("Fehler beim Abrufen der Dokumente: ", error);
        throw error;
    }
}

function addUserToLeaderboard(username, points) {
  users.push({ username, points });

  users.sort((a, b) => b.points - a.points);

  const tableBody = document.querySelector('#leaderboard tbody');
  tableBody.innerHTML = '';

  users.forEach((user, index) => {
      const newRow = document.createElement('tr');
      
      const rankCell = document.createElement('td');
      rankCell.textContent = index + 1;

      const usernameCell = document.createElement('td');
      usernameCell.textContent = user.username;

      const pointsCell = document.createElement('td');
      pointsCell.textContent = user.points;

      newRow.appendChild(rankCell);
      newRow.appendChild(usernameCell);
      newRow.appendChild(pointsCell);

      // Anwenden der CSS-Klasse auf die neue Zeile
      newRow.style.height = '30px';

      // Füge die Zeile zum tbody hinzu
      tableBody.appendChild(newRow);
  });
}


// Leaderboard laden
window.loadLeaderboard = async function () {
    try {
        const documents = await getAllDocuments("player");

        // Sortiere die Dokumente nach dem score
        documents.sort((a, b) => b.score - a.score);

        // Erstelle die Benutzerdatenliste
        const users = documents.map(doc => ({
            username: doc.name,
            points: doc.score
        }));

        // Füge die Benutzerdaten dem Leaderboard hinzu
        addUserToLeaderboard(users);
    } catch (error) {
        console.error("Fehler beim Laden des Leaderboards: ", error);
    }
};
