const Diagnostic = require("../models/Diagnostic")
const User = require("../models/User")
const mongoose = require("mongoose")

// @desc    Créer un diagnostic
// @route   POST /api/diagnostics
// @access  Private (Coach)
exports.createDiagnostic = async (req, res) => {
  try {
    const { userId, diagnostic, responses, aiAnalysis } = req.body

    if (!userId || !diagnostic) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir l'ID de l'utilisateur et le diagnostic",
      })
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      })
    }

    // Créer le diagnostic
    const newDiagnostic = await Diagnostic.create({
      userId,
      userName: user.name,
      diagnostic,
      responses: responses || {},
      aiAnalysis: aiAnalysis || {},
      coachNotes: "",
    })

    // Mettre à jour le diagnostic de l'utilisateur
    user.diagnostic = diagnostic
    await user.save()

    res.status(201).json({
      success: true,
      message: "Diagnostic créé avec succès",
      data: newDiagnostic,
    })
  } catch (error) {
    console.error("Erreur lors de la création du diagnostic:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du diagnostic",
      error: error.message,
    })
  }
}

// @desc    Obtenir tous les diagnostics d'un utilisateur
// @route   GET /api/diagnostics/user/:userId
// @access  Private
exports.getUserDiagnostics = async (req, res) => {
  try {
    const { userId } = req.params

    // Vérifier si l'utilisateur a le droit d'accéder à ces diagnostics
    if (req.user.role !== "coach" && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé à accéder à ces diagnostics",
      })
    }

    const diagnostics = await Diagnostic.find({ userId }).sort({ date: -1 })

    res.status(200).json({
      success: true,
      count: diagnostics.length,
      data: diagnostics,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des diagnostics:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des diagnostics",
      error: error.message,
    })
  }
}

// @desc    Obtenir un diagnostic spécifique
// @route   GET /api/diagnostics/:id
// @access  Private
exports.getDiagnostic = async (req, res) => {
  try {
    const diagnostic = await Diagnostic.findById(req.params.id)

    if (!diagnostic) {
      return res.status(404).json({
        success: false,
        message: "Diagnostic non trouvé",
      })
    }

    // Vérifier si l'utilisateur a le droit d'accéder à ce diagnostic
    if (req.user.role !== "coach" && req.user._id.toString() !== diagnostic.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé à accéder à ce diagnostic",
      })
    }

    res.status(200).json({
      success: true,
      data: diagnostic,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération du diagnostic:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du diagnostic",
      error: error.message,
    })
  }
}

// @desc    Mettre à jour un diagnostic
// @route   PUT /api/diagnostics/:id
// @access  Private (Coach)
exports.updateDiagnostic = async (req, res) => {
  try {
    const { diagnostic, coachNotes, aiAnalysis, coachValidation } = req.body

    // Vérifier si l'utilisateur est un coach
    if (req.user.role !== "coach") {
      return res.status(403).json({
        success: false,
        message: "Seuls les coachs peuvent mettre à jour les diagnostics",
      })
    }

    const updatedDiagnostic = await Diagnostic.findByIdAndUpdate(
      req.params.id,
      {
        ...(diagnostic && { diagnostic }),
        ...(coachNotes && { coachNotes }),
        ...(aiAnalysis && { aiAnalysis }),
        ...(coachValidation && { coachValidation }),
      },
      { new: true, runValidators: true },
    )

    if (!updatedDiagnostic) {
      return res.status(404).json({
        success: false,
        message: "Diagnostic non trouvé",
      })
    }

    // Si le diagnostic a été mis à jour, mettre à jour également l'utilisateur
    if (diagnostic) {
      await User.findByIdAndUpdate(updatedDiagnostic.userId, { diagnostic })
    }

    res.status(200).json({
      success: true,
      message: "Diagnostic mis à jour avec succès",
      data: updatedDiagnostic,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du diagnostic:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du diagnostic",
      error: error.message,
    })
  }
}

// @desc    Supprimer un diagnostic
// @route   DELETE /api/diagnostics/:id
// @access  Private (Coach)
exports.deleteDiagnostic = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est un coach
    if (req.user.role !== "coach") {
      return res.status(403).json({
        success: false,
        message: "Seuls les coachs peuvent supprimer les diagnostics",
      })
    }

    const diagnostic = await Diagnostic.findByIdAndDelete(req.params.id)

    if (!diagnostic) {
      return res.status(404).json({
        success: false,
        message: "Diagnostic non trouvé",
      })
    }

    res.status(200).json({
      success: true,
      message: "Diagnostic supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la suppression du diagnostic:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du diagnostic",
      error: error.message,
    })
  }
}

// @desc    Obtenir tous les diagnostics (pour les coachs)
// @route   GET /api/diagnostics
// @access  Private (Coach)
exports.getAllDiagnostics = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est un coach
    if (req.user.role !== "coach") {
      return res.status(403).json({
        success: false,
        message: "Seuls les coachs peuvent voir tous les diagnostics",
      })
    }

    const diagnostics = await Diagnostic.find().sort({ date: -1 })

    res.status(200).json({
      success: true,
      count: diagnostics.length,
      data: diagnostics,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des diagnostics:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des diagnostics",
      error: error.message,
    })
  }
}

// @desc    Valider l'analyse IA d'un diagnostic
// @route   PUT /api/diagnostics/:id/validate
// @access  Private (Coach)
exports.validateDiagnostic = async (req, res) => {
  try {
    const { isValid, coachNotes } = req.body

    // Vérifier si l'utilisateur est un coach
    if (req.user.role !== "coach") {
      return res.status(403).json({
        success: false,
        message: "Seuls les coachs peuvent valider les diagnostics",
      })
    }

    const diagnostic = await Diagnostic.findById(req.params.id)

    if (!diagnostic) {
      return res.status(404).json({
        success: false,
        message: "Diagnostic non trouvé",
      })
    }

    // Mettre à jour la validation
    diagnostic.coachValidation = {
      isValid,
      coachNotes,
      validationDate: new Date(),
    }

    await diagnostic.save()

    res.status(200).json({
      success: true,
      message: "Diagnostic validé avec succès",
      data: diagnostic,
    })
  } catch (error) {
    console.error("Erreur lors de la validation du diagnostic:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la validation du diagnostic",
      error: error.message,
    })
  }
}
