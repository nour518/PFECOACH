const geminiService = require('../services/geminiService');
const Diagnostic = require('../models/Diagnostic');

const generateDiagnostic = async (req, res) => {
  try {
    const { userId, responses, metadata } = req.body;

    if (!userId || !responses || !metadata) {
      return res.status(400).json({ error: 'L\'ID utilisateur, les réponses et les métadonnées sont requis.' });
    }

    // Générer le diagnostic avec Gemini
    const diagnostic = await geminiService.generateDiagnostic(responses, metadata);

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

module.exports = { generateDiagnostic };