const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../models/User"); // Pour récupérer l'utilisateur, si nécessaire
<<<<<<< HEAD
const Diagnostic = require("../models/Diagnostic"); // Correcte casse avec PascalCase
=======
const diagnostic = require("../models/diagnostic");
>>>>>>> 6794824 (Ajout du code)

// Fonction pour obtenir un diagnostic de test à partir de Gemini
const getGeminiDiagnostic = async (req, res) => {
  try {
    const { userId, testData } = req.body;

    // Vérifier la présence des données requises
    if (!userId || !testData) {
      return res.status(400).json({
        status: "error",
        message: "L'ID utilisateur et les données du test sont requis",
      });
    }

    // Vérifier si l'ID utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "ID utilisateur invalide",
      });
    }

    // Appel API Gemini (Vérifier si l'URL et la clé API sont correctes)
    const response = await axios.post("https://api.gemini.com/v1/diagnostic", {
      apiKey: process.env.GEMINI_API_KEY, // Assurez-vous que cette clé API est définie
      testData,
    });

    // Récupération du résultat du diagnostic
    const diagnosticResult = response.data;

    res.status(200).json({
      status: "success",
      diagnostic: diagnosticResult,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du diagnostic Gemini:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération du diagnostic Gemini",
      error: error.message,
    });
  }
};

// Récupérer le diagnostic d'un utilisateur
const getDiagnostic = async (req, res) => {
  try {
    const { userId } = req.params;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "ID utilisateur invalide",
      });
    }

    // Récupérer le diagnostic le plus récent de l'utilisateur
    const diagnostic = await Diagnostic.findOne({ userId }).sort({ date: -1 });

    if (!diagnostic) {
      return res.status(404).json({
        status: "error",
        message: "Aucun diagnostic trouvé pour cet utilisateur.",
      });
    }

    res.status(200).json({
      status: "success",
      diagnostic,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du diagnostic:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur interne lors de la récupération du diagnostic.",
      error: error.message,
    });
  }
};

// Créer un nouveau diagnostic
const createDiagnostic = async (req, res) => {
  try {
    const { userId, responses, diagnostic } = req.body;

    // Vérifier si l'ID est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "ID utilisateur invalide",
      });
    }

    // Vérifier si les données requises sont présentes
    if (!responses || !diagnostic) {
      return res.status(400).json({
        status: "error",
        message: "Les réponses et le diagnostic sont requis",
      });
    }

    // Création du diagnostic
    const newDiagnostic = new Diagnostic({
      userId,
      responses,
      diagnostic,
    });

    await newDiagnostic.save();

    res.status(201).json({
      status: "success",
      diagnostic: newDiagnostic,
    });
  } catch (error) {
    console.error("Erreur lors de la création du diagnostic:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur interne lors de la création du diagnostic.",
      error: error.message,
    });
  }
};

// Exporter les contrôleurs
module.exports = {
  getGeminiDiagnostic,
  getDiagnostic,
  createDiagnostic,
<<<<<<< HEAD
};
=======
};
>>>>>>> 6794824 (Ajout du code)
