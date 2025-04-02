// routes/diagnosticRoutes.js
const express = require('express');
const router = express.Router();
const { getGeminiDiagnostic } = require('../controllers/diagnosticController');

// Route pour récupérer le diagnostic via Gemini
router.post('/get-diagnostic', getGeminiDiagnostic);

module.exports = router;
