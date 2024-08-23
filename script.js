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

async function getDeviationName(devId){
  const doc = await db.collection("deviations").doc("deviations").get();
  if (doc.exists) {
    return doc.data().devId;
  } else {
    console.log("Kein Spielstand gefunden.");
    return null;
  }
}

async function buttonClicked() {
  try {
    // Warten auf die Promise von getDeviationName
    const deviationName = await getDeviationName("d1");
    
    // Den Text des Buttons aktualisieren
    //document.getElementById("testButton").innerText = deviationName ? deviationName : "Keine Daten";
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Buttons:", error);
    document.getElementById("testButton").innerText = "Fehler";
  }
}
