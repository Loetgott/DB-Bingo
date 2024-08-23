


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

// Spielstand abrufen
async function getGameScore(userId) {
  const doc = await db.collection("gameScores").doc(userId).get();
  if (doc.exists) {
    return doc.data().score;
  } else {
    console.log("Kein Spielstand gefunden.");
    return null;
  }
}

async function getDeviationField(devId) {
  console.log("suche nach Feld mit id " + devId + " ...")
  try {
    // Zugriff auf das Dokument in der Sammlung "deviations"
    const doc = await db.collection("deviations").doc("deviations").get();
    
    if (doc.exists) {
      console.log("Dokumentdaten:", doc.data());
      
      // Zugriff auf das Feld "d1"
      const fieldValue = doc.data().devId; 
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

async function buttonClicked() {
  try {
    const fieldValue = await getDeviationField();
    console.log("Abgerufener Wert:", fieldValue);
    document.getElementById("testButton").innerText = fieldValue;
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Buttons:", error);
    document.getElementById("testButton").innerText = "Fehler";
  }
}

async function loadTable() {
  for (let i = 1; i < 26; i++) {
      const element = document.getElementById("bingoField" + i);
      
      if (element) {
          try {
              const value = await getDeviationField("d" + i);
              element.textContent = value;
          } catch (error) {
              console.error(`Fehler beim Abrufen des Werts für d${i}:`, error);
          }
      } else {
          console.warn(`Element mit ID bingofield${i} nicht gefunden.`);
      }
  }
}

