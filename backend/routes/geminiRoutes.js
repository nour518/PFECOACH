const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController'); // Importez le contrôleur

// Route pour générer un diagnostic
router.post('/diagnostic', geminiController.generateDiagnostic);

// Exporter le routeur
module.exports = router;