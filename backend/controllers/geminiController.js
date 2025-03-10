const geminiService = require('../services/geminiService');
const Diagnostic = require('../models/diagnostic');

const generateDiagnostic = async (req, res) => {
  try {
    const { userId, responses, prompt } = req.body;

    if (!userId || !responses || !prompt) {
      return res.status(400).json({ error: 'L\'ID utilisateur, les réponses et le prompt sont requis.' });
    }

    // Générer le diagnostic avec Gemini
    const diagnostic = await geminiService.generateDiagnostic(responses, prompt);

    // Enregistrer le diagnostic dans la base de données
    const newDiagnostic = new Diagnostic({ userId, responses, diagnostic });
    await newDiagnostic.save();

    // Renvoyer le diagnostic à l'utilisateur
    res.json({ diagnostic });
  } catch (error) {
    console.error('Erreur lors de la génération du diagnostic:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du diagnostic.' });
  }
};

// Exporter la fonction
module.exports = { generateDiagnostic };