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
    const tableElement = document.getElementById('table');
    const loadingElement = document.getElementById('loading');

    for (let i = 1; i < 26; i++) {
        const element = document.getElementById("d" + i);
        if (element) {
            try {
                const value = await getDeviationField("d" + i);
                element.textContent = value;

                if (await getData("player", getUserId(), "d" + i) == true) {
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
        }
    }

    // Sobald alle Daten geladen sind, Ladeanimation ausblenden und Tabelle sichtbar machen
    loadingElement.style.display = 'none';  // Ladeanimation verstecken
    tableElement.classList.add('visible');  // Tabelle anzeigen
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
    console.log(typeof fieldValue, fieldValue);
    const docRef = doc(db, "player", String(playerId));

    return setDoc(docRef, {
        [fieldName]: fieldValue,
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

window.setLoggedIn = setLoggedIn;
window.getLoggedIn = getLoggedIn;
window.setUserId = setUserId;
window.getUserId = getUserId;
window.saveData = saveData;

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

function addUserToLeaderboard(users) {
    const tableBody = document.querySelector('#leaderboard tbody');
    tableBody.innerHTML = '';

    users.forEach((user, index) => {
        const newRow = document.createElement('tr');
        const rankCell = document.createElement('th');
        rankCell.textContent = index + 1;

        const usernameCell = document.createElement('th');
        usernameCell.textContent = user.username;

        const pointsCell = document.createElement('th');
        pointsCell.textContent = user.points;

        newRow.appendChild(rankCell);
        newRow.appendChild(usernameCell);
        newRow.appendChild(pointsCell);
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

import { auth } from './firebase.js'; // Importiere auth aus firebase.js
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

let passwordChangeSucces = false;

window.getPasswordChangeSucces = function(){
    return passwordChangeSucces;
}

window.changePassword = async function(oldPassword, newPassword) {
    var user = auth.currentUser;
    var email = user.email;

    // Re-Authentifizierung des Benutzers mit dem alten Passwort
    var credential = EmailAuthProvider.credential(email, oldPassword);

    try {
        await reauthenticateWithCredential(user, credential);
        // Re-Authentifizierung erfolgreich, neues Passwort setzen
        await updatePassword(user, newPassword);
        console.log('Passwort erfolgreich geändert.');
        passwordChangeSucces = true;
    } catch (error) {
        if (error.code === 'auth/wrong-password') {
            console.error('Das alte Passwort ist falsch.');
        } else {
            console.error('Fehler beim Ändern des Passworts:', error);
        }
    }
};
