const mongoose = require('mongoose');
const geminiService = require('../services/geminiService');
const Diagnostic = require('../models/Diagnostic');

const generateDiagnostic = async (req, res) => {
  try {
    let { userId, responses, prompt } = req.body;

    if (!userId || !responses || !prompt) {
      return res.status(400).json({ error: 'L\'ID utilisateur, les réponses et le prompt sont requis.' });
    }

    // Vérifier si userId est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID utilisateur invalide' });
    }

    userId = new mongoose.Types.ObjectId(userId); // Conversion en ObjectId

    console.log("Réponses de l'utilisateur :", responses);

    // Générer le diagnostic avec Gemini
    const diagnostic = await geminiService.generateDiagnostic(responses, prompt);

    // Enregistrer le diagnostic dans la base de données
    const newDiagnostic = new Diagnostic({ userId, responses, diagnostic });
    await newDiagnostic.save();

    // Renvoyer le diagnostic à l'utilisateur
    res.json({ diagnostic });
  } catch (error) {
    console.error('Erreur lors de la génération du diagnostic:', error);
    res.status(500).json({ error: error.message || 'Erreur lors de la génération du diagnostic.' });
  }
};

module.exports = { generateDiagnostic };