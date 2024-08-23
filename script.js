// Spielstand speichern
async function saveGameScore(userId, score) {
  try {
    await db.collection("gameScores").doc(userId).set({
      score: score
    });
    console.log("Spielstand gespeichert!");
  } catch (error) {
    console.error("Fehler beim Speichern des Spielstands:", error);
  }
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
