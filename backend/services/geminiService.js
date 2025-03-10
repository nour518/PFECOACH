require('dotenv').config();
const axios = require('axios');

// Charger la clé API depuis .env
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {  // Correction ici
  console.error("❌ Clé OpenAI/Gemini manquante !");
  process.exit(1);
}

console.log("✅ Clé OpenAI/Gemini chargée avec succès !");

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const geminiService = {
  generateDiagnostic: async (responses, prompt) => {
    try {
      console.log("Prompt envoyé à Gemini :", prompt);

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

      console.log("Réponse de l'API Gemini :", response.data);

      // Vérifier si la réponse contient des données valides
      if (!response.data || !response.data.candidates || !response.data.candidates[0].content.parts[0].text) {
        throw new Error("Réponse inattendue de l'API Gemini.");
      }

      // Extraire le texte généré par Gemini
      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Erreur API Gemini :', error.response ? error.response.data : error.message);
      throw new Error('Erreur lors de la génération du diagnostic. Veuillez réessayer.');
    }
  }
};

module.exports = geminiService;
