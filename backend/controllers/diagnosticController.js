// controllers/diagnosticController.js
const axios = require('axios');
const User = require('../models/User'); // Pour récupérer l'utilisateur, si nécessaire

// Fonction pour obtenir un diagnostic de test à partir de Gemini
const getGeminiDiagnostic = async (req, res) => {
  try {
    const { userId, testData } = req.body; // Données du test (ex : ID utilisateur et données nécessaires)

    // Vous pouvez ajouter ici une validation des données si nécessaire

    // Appel API Gemini avec le test (assurez-vous que le bon endpoint et méthode sont utilisés)
    const response = await axios.post('https://api.gemini.com/v1/diagnostic', {
      apiKey: process.env.GEMINI_API_KEY, // Clé API de Gemini
      testData: testData, // Les données envoyées à Gemini pour le diagnostic
    });

    // Vous pouvez manipuler la réponse de Gemini selon vos besoins
    const diagnosticResult = response.data; // Cela dépend de ce que l'API Gemini renvoie

    // Exemple de réponse
    res.status(200).json({
      success: true,
      diagnostic: diagnosticResult, // Le résultat du diagnostic de Gemini
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du diagnostic:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur lors de la récupération du diagnostic',
    });
  }
};

// Exporter les contrôleurs
module.exports = {
  getGeminiDiagnostic,
};
