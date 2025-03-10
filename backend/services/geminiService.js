require('dotenv').config();
const axios = require('axios');
const API_KEY = process.env.API_KEY; // Charger la clé API depuis .env
// Charger la clé API depuis .env
const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const geminiService = {
  /**
   * Génère un diagnostic à partir des réponses de l'utilisateur.
   * @param {Object} responses - Les réponses de l'utilisateur.
   * @param {string} prompt - Le prompt personnalisé.
   * @returns {Promise<string>} - Le diagnostic généré par Gemini.
   */
  generateDiagnostic: async (responses, prompt) => {
    try {
      // Envoyer la requête à l'API Gemini
      const response = await axios.post(
        `${BASE_URL}?key=${API_KEY}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extraire le texte généré par Gemini
      const generatedText = response.data.candidates[0].content.parts[0].text;
      return generatedText;
    } catch (error) {
      console.error('Erreur lors de la génération du diagnostic:', error.response ? error.response.data : error.message);
      throw new Error('Erreur lors de la génération du diagnostic. Veuillez réessayer.');
    }
  }
};

module.exports = geminiService;