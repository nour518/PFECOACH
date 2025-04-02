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

