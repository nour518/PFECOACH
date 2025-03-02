// backend/routes/geminiRoutes.js
const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

// Route pour générer du contenu avec Gemini
router.post('/generate-content', async (req, res) => {
  try {
    const { text } = req.body; // Récupérer le texte envoyé dans la requête

    if (!text) {
      return res.status(400).json({ error: 'Le texte est requis.' });
    }

    // Appeler le service Gemini pour générer le contenu
    const response = await geminiService.generateContent(text);

    // Répondre avec les données générées par Gemini
    res.json(response);
  } catch (error) {
    console.error('Erreur dans la génération du contenu avec Gemini:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du contenu.' });
  }
});

module.exports = router;
