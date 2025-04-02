<<<<<<< HEAD
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
=======
const Diagnostic = require("../models/Diagnostic")
const mongoose = require("mongoose")

// Récupérer le diagnostic d'un utilisateur
const getDiagnostic = async (req, res) => {
  try {
    const { userId } = req.params

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "ID utilisateur invalide",
      })
    }

    // Récupérer le diagnostic le plus récent
    const diagnostic = await Diagnostic.findOne({ userId }).sort({ date: -1 })

    if (!diagnostic) {
      return res.status(404).json({
        status: "error",
        message: "Aucun diagnostic trouvé pour cet utilisateur.",
      })
    }

    res.status(200).json({
      status: "success",
      diagnostic,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération du diagnostic:", error)
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération du diagnostic.",
      error: error.message,
    })
  }
}

// Créer un nouveau diagnostic
const createDiagnostic = async (req, res) => {
  try {
    const { userId, responses, diagnostic } = req.body

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "ID utilisateur invalide",
      })
    }

    // Vérifier si les données requises sont présentes
    if (!responses || !diagnostic) {
      return res.status(400).json({
        status: "error",
        message: "Les réponses et le diagnostic sont requis",
      })
    }

    // Créer un nouveau diagnostic
    const newDiagnostic = new Diagnostic({
      userId,
      responses,
      diagnostic,
    })

    await newDiagnostic.save()

    res.status(201).json({
      status: "success",
      diagnostic: newDiagnostic,
    })
  } catch (error) {
    console.error("Erreur lors de la création du diagnostic:", error)
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la création du diagnostic.",
      error: error.message,
    })
  }
}

module.exports = {
  getDiagnostic,
  createDiagnostic,
}

>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
