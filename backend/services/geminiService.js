require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.API_KEY; // Charger la clé API depuis .env
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const geminiService = {
  generateContent: async (text) => {
    try {
      const response = await axios.post(
        `${BASE_URL}?key=${API_KEY}`,
        {
          contents: [{
            parts: [{ text }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      // Ajoute plus de détails pour l'erreur
      console.error('Error generating content:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

module.exports = geminiService;
