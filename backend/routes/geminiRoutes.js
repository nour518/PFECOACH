const express = require("express");
const router = express.Router();
const { generateDiagnostic } = require("../controllers/geminiController");

// Route de test simple pour vérifier que le serveur fonctionne
router.get("/test", (req, res) => {
  console.log("Route de test Gemini appelée avec succès");
  res.status(200).json({ message: "API Gemini fonctionne correctement" });
});

// Route pour générer un diagnostic avec Gemini
router.post("/diagnostic", generateDiagnostic);

// Ajoutons également une route OPTIONS pour gérer les requêtes préflight CORS
router.options("/diagnostic", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).send();
});

module.exports = router;
