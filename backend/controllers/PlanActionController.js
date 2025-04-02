const mongoose = require("mongoose")
const PlanAction = require("../models/PlanAction")

// 1. Récupérer le plan d'action d'un utilisateur
const getPlanAction = async (req, res) => {
  try {
    const { userId } = req.params

    // Vérifier si l'utilisateur existe
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "ID utilisateur invalide",
      })
    }

    // Récupérer le plan d'action le plus récent pour cet utilisateur
    const planAction = await PlanAction.findOne({ userId }).sort({ createdAt: -1 })

    if (!planAction) {
      return res.status(404).json({
        status: "error",
        message: "Aucun plan d'action trouvé pour cet utilisateur.",
      })
    }

    // Renvoyer le plan d'action
    res.status(200).json(planAction)
  } catch (error) {
    console.error("Erreur lors de la récupération du plan d'action :", error)
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération du plan d'action.",
      error: error.message,
    })
  }
}

// 2. Mettre à jour le statut d'une tâche
const updateTaskStatus = async (req, res) => {
  try {
    const { userId, taskId } = req.params
    const { completed } = req.body

    // Vérifier si les IDs sont valides
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "ID utilisateur invalide",
      })
    }

    // Trouver le plan d'action de l'utilisateur
    const planAction = await PlanAction.findOne({ userId })

    if (!planAction) {
      return res.status(404).json({
        status: "error",
        message: "Aucun plan d'action trouvé pour cet utilisateur.",
      })
    }

    // Trouver la tâche à mettre à jour
    const task = planAction.tasks.id(taskId)

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Tâche non trouvée.",
      })
    }

    // Mettre à jour le statut de la tâche
    task.completed = completed
    await planAction.save()

    // Renvoyer le plan d'action mis à jour
    res.status(200).json({
      status: "success",
      data: planAction,
    })
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche :", error)
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la mise à jour de la tâche.",
      error: error.message,
    })
  }
}

// 3. Créer ou mettre à jour un plan d'action
const savePlanAction = async (req, res) => {
  try {
    const { userId, tasks } = req.body

    // Vérifier si l'ID utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "ID utilisateur invalide",
      })
    }

    // Vérifier si des tâches sont fournies
    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({
        status: "error",
        message: "Les tâches doivent être fournies sous forme de tableau.",
      })
    }

    // Trouver ou créer un plan d'action pour cet utilisateur
    let planAction = await PlanAction.findOne({ userId })

    if (!planAction) {
      // Créer un nouveau plan d'action
      planAction = new PlanAction({ userId, tasks })
    } else {
      // Mettre à jour les tâches existantes
      planAction.tasks = tasks
    }

    // Sauvegarder le plan d'action
    await planAction.save()

    // Renvoyer le plan d'action sauvegardé
    res.status(201).json({
      status: "success",
      data: planAction,
    })
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du plan d'action :", error)
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la sauvegarde du plan d'action.",
      error: error.message,
    })
  }
}

// 4. Supprimer un plan d'action
const deletePlanAction = async (req, res) => {
  try {
    const { userId } = req.params

    // Vérifier si l'ID utilisateur est valide
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "ID utilisateur invalide",
      })
    }

    // Supprimer le plan d'action de l'utilisateur
    const result = await PlanAction.deleteOne({ userId })

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Aucun plan d'action trouvé pour cet utilisateur.",
      })
    }

    // Renvoyer une confirmation de suppression
    res.status(200).json({
      status: "success",
      message: "Plan d'action supprimé avec succès.",
    })
  } catch (error) {
    console.error("Erreur lors de la suppression du plan d'action :", error)
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la suppression du plan d'action.",
      error: error.message,
    })
  }
}

module.exports = {
  getPlanAction,
  updateTaskStatus,
  savePlanAction,
  deletePlanAction,
}

