require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const geminiService = {
  generateDiagnostic: async (responses, basePrompt) => {
    try {
      // Structurer le prompt final
      const fullPrompt = `
        ${basePrompt}
        
        Réponses de l'utilisateur:
        ${JSON.stringify(responses, null, 2)}
        
        Veuillez analyser ces réponses et fournir:
        1. Un diagnostic clair
        2. 3 recommandations personnalisées
        3. Une analyse des points clés
      `;

      const requestBody = {
        contents: [{
          role: "user",
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.9
        }
      };

      const response = await axios.post(
        `${BASE_URL}?key=${API_KEY}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30s timeout
        }
      );

      // Nouvelle structure de réponse pour Gemini 1.5
      const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!result) {
        console.error('Structure de réponse inattendue:', response.data);
        throw new Error('Format de réponse inattendu de Gemini');
      }

      return {
        analysis: result,
        rawResponse: response.data // Pour le débogage
      };

    } catch (error) {
      console.error('Erreur Gemini:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      
      throw new Error(
        error.response?.data?.error?.message || 
        'Erreur de communication avec le service d\'analyse'
      );
    }
  }
};

module.exports = geminiService;