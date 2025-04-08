const ActionPlan = require("../models/ActionPlan")
const User = require("../models/User")
const mongoose = require("mongoose")

// @desc    Créer un plan d'action
// @route   POST /api/action-plans
// @access  Private (Coach)
exports.createActionPlan = async (req, res) => {
  try {
    const { userId, title, description, deadline, status } = req.body

    if (!userId || !title || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir l'ID de l'utilisateur, le titre, la description et la date limite",
      })
    }

    // Vérifier si l'utilisateur est un coach
    if (req.user.role !== "coach") {
      return res.status(403).json({
        success: false,
        message: "Seuls les coachs peuvent créer des plans d'action",
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

    // Créer le plan d'action
    const newActionPlan = await ActionPlan.create({
      userId,
      userName: user.name,
      title,
      description,
      deadline,
      status: status || "pending",
      coachId: req.user._id,
    })

    // Mettre à jour le plan d'action de l'utilisateur
    user.planAction = `${title}: ${description}`
    await user.save()

    res.status(201).json({
      success: true,
      message: "Plan d'action créé avec succès",
      data: newActionPlan,
    })
  } catch (error) {
    console.error("Erreur lors de la création du plan d'action:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du plan d'action",
      error: error.message,
    })
  }
}

// @desc    Obtenir tous les plans d'action d'un utilisateur
// @route   GET /api/action-plans/user/:userId
// @access  Private
exports.getUserActionPlans = async (req, res) => {
  try {
    const { userId } = req.params

    // Vérifier si l'utilisateur a le droit d'accéder à ces plans d'action
    if (req.user.role !== "coach" && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé à accéder à ces plans d'action",
      })
    }

    const actionPlans = await ActionPlan.find({ userId }).sort({ createdDate: -1 })

    res.status(200).json({
      success: true,
      count: actionPlans.length,
      data: actionPlans,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des plans d'action:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des plans d'action",
      error: error.message,
    })
  }
}

// @desc    Obtenir un plan d'action spécifique
// @route   GET /api/action-plans/:id
// @access  Private
exports.getActionPlan = async (req, res) => {
  try {
    const actionPlan = await ActionPlan.findById(req.params.id)

    if (!actionPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan d'action non trouvé",
      })
    }

    // Vérifier si l'utilisateur a le droit d'accéder à ce plan d'action
    if (req.user.role !== "coach" && req.user._id.toString() !== actionPlan.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé à accéder à ce plan d'action",
      })
    }

    res.status(200).json({
      success: true,
      data: actionPlan,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération du plan d'action:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du plan d'action",
      error: error.message,
    })
  }
}

// @desc    Mettre à jour un plan d'action
// @route   PUT /api/action-plans/:id
// @access  Private (Coach ou Utilisateur concerné)
exports.updateActionPlan = async (req, res) => {
  try {
    const { title, description, deadline, status } = req.body

    const actionPlan = await ActionPlan.findById(req.params.id)

    if (!actionPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan d'action non trouvé",
      })
    }

    // Vérifier si l'utilisateur a le droit de mettre à jour ce plan d'action
    if (req.user.role !== "coach" && req.user._id.toString() !== actionPlan.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé à mettre à jour ce plan d'action",
      })
    }

    // Si l'utilisateur n'est pas un coach, il ne peut mettre à jour que le statut
    if (req.user.role !== "coach" && (title || description || deadline)) {
      return res.status(403).json({
        success: false,
        message: "Seuls les coachs peuvent modifier le titre, la description et la date limite",
      })
    }

    // Mettre à jour le plan d'action
    if (title) actionPlan.title = title
    if (description) actionPlan.description = description
    if (deadline) actionPlan.deadline = deadline
    if (status) actionPlan.status = status

    await actionPlan.save()

    // Si le titre ou la description ont été mis à jour, mettre à jour également l'utilisateur
    if (title || description) {
      const user = await User.findById(actionPlan.userId)
      if (user) {
        user.planAction = `${actionPlan.title}: ${actionPlan.description}`
        await user.save()
      }
    }

    res.status(200).json({
      success: true,
      message: "Plan d'action mis à jour avec succès",
      data: actionPlan,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du plan d'action:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du plan d'action",
      error: error.message,
    })
  }
}

// @desc    Supprimer un plan d'action
// @route   DELETE /api/action-plans/:id
// @access  Private (Coach)
exports.deleteActionPlan = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est un coach
    if (req.user.role !== "coach") {
      return res.status(403).json({
        success: false,
        message: "Seuls les coachs peuvent supprimer les plans d'action",
      })
    }

    const actionPlan = await ActionPlan.findByIdAndDelete(req.params.id)

    if (!actionPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan d'action non trouvé",
      })
    }

    res.status(200).json({
      success: true,
      message: "Plan d'action supprimé avec succès",
    })
  } catch (error) {
    console.error("Erreur lors de la suppression du plan d'action:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du plan d'action",
      error: error.message,
    })
  }
}

// @desc    Obtenir tous les plans d'action (pour les coachs)
// @route   GET /api/action-plans
// @access  Private (Coach)
exports.getAllActionPlans = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est un coach
    if (req.user.role !== "coach") {
      return res.status(403).json({
        success: false,
        message: "Seuls les coachs peuvent voir tous les plans d'action",
      })
    }

    const actionPlans = await ActionPlan.find().sort({ createdDate: -1 })

    res.status(200).json({
      success: true,
      count: actionPlans.length,
      data: actionPlans,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des plans d'action:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des plans d'action",
      error: error.message,
    })
  }
}

// @desc    Ajouter une mise à jour de progression
// @route   POST /api/action-plans/:id/progress
// @access  Private (Coach ou Utilisateur concerné)
exports.addProgressUpdate = async (req, res) => {
  try {
    const { note } = req.body

    if (!note) {
      return res.status(400).json({
        success: false,
        message: "Veuillez fournir une note de progression",
      })
    }

    const actionPlan = await ActionPlan.findById(req.params.id)

    if (!actionPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan d'action non trouvé",
      })
    }

    // Vérifier si l'utilisateur a le droit d'ajouter une mise à jour
    if (req.user.role !== "coach" && req.user._id.toString() !== actionPlan.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé à ajouter une mise à jour à ce plan d'action",
      })
    }

    // Ajouter la mise à jour
    actionPlan.progressUpdates.push({
      date: new Date(),
      note,
    })

    await actionPlan.save()

    res.status(200).json({
      success: true,
      message: "Mise à jour ajoutée avec succès",
      data: actionPlan,
    })
  } catch (error) {
    console.error("Erreur lors de l'ajout de la mise à jour:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'ajout de la mise à jour",
      error: error.message,
    })
  }
}
