const ActionPlan = require("../models/ActionPlan")
const Notification = require("../models/Notification")

// Créer un nouveau plan d'action
const createActionPlan = async (req, res) => {
  try {
    const { userId, title, description, tasks } = req.body
    const coachId = req.user.id

    const newActionPlan = new ActionPlan({
      userId,
      coachId,
      title,
      description,
      tasks: tasks || [],
    })

    const savedActionPlan = await newActionPlan.save()

    // Créer une notification pour l'utilisateur
    const notification = new Notification({
      recipient: userId,
      sender: coachId,
      type: "task_assigned",
      title: "Nouveau plan d'action",
      message: `Un nouveau plan d'action "${title}" a été créé pour vous.`,
      relatedTo: {
        model: "ActionPlan",
        id: savedActionPlan._id,
      },
    })

    await notification.save()

    res.status(201).json(savedActionPlan)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du plan d'action", error: error.message })
  }
}

// Récupérer tous les plans d'action d'un utilisateur
const getUserActionPlans = async (req, res) => {
  try {
    const { userId } = req.params
    const actionPlans = await ActionPlan.find({ userId }).populate("coachId", "name email").sort({ createdAt: -1 })

    res.status(200).json(actionPlans)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des plans d'action", error: error.message })
  }
}

// Récupérer tous les plans d'action créés par un coach
const getCoachActionPlans = async (req, res) => {
  try {
    const coachId = req.user.id
    const actionPlans = await ActionPlan.find({ coachId }).populate("userId", "name email").sort({ createdAt: -1 })

    res.status(200).json(actionPlans)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des plans d'action", error: error.message })
  }
}

// Récupérer un plan d'action spécifique
const getActionPlan = async (req, res) => {
  try {
    const { planId } = req.params
    const actionPlan = await ActionPlan.findById(planId)
      .populate("userId", "name email")
      .populate("coachId", "name email")

    if (!actionPlan) {
      return res.status(404).json({ message: "Plan d'action non trouvé" })
    }

    res.status(200).json(actionPlan)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du plan d'action", error: error.message })
  }
}

// Mettre à jour un plan d'action
const updateActionPlan = async (req, res) => {
  try {
    const { planId } = req.params
    const { title, description, status } = req.body

    const actionPlan = await ActionPlan.findById(planId)

    if (!actionPlan) {
      return res.status(404).json({ message: "Plan d'action non trouvé" })
    }

    // Vérifier que l'utilisateur est le coach qui a créé le plan
    if (actionPlan.coachId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce plan d'action" })
    }

    actionPlan.title = title || actionPlan.title
    actionPlan.description = description || actionPlan.description
    actionPlan.status = status || actionPlan.status

    const updatedActionPlan = await actionPlan.save()

    res.status(200).json(updatedActionPlan)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du plan d'action", error: error.message })
  }
}

// Ajouter une tâche à un plan d'action
const addTask = async (req, res) => {
  try {
    const { planId } = req.params
    const { title, description, deadline } = req.body

    const actionPlan = await ActionPlan.findById(planId)

    if (!actionPlan) {
      return res.status(404).json({ message: "Plan d'action non trouvé" })
    }

    // Vérifier que l'utilisateur est le coach qui a créé le plan
    if (actionPlan.coachId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce plan d'action" })
    }

    const newTask = {
      title,
      description,
      deadline,
      status: "a_faire",
    }

    actionPlan.tasks.push(newTask)
    const updatedActionPlan = await actionPlan.save()

    // Créer une notification pour l'utilisateur
    const notification = new Notification({
      recipient: actionPlan.userId,
      sender: req.user.id,
      type: "task_assigned",
      title: "Nouvelle tâche assignée",
      message: `Une nouvelle tâche "${title}" a été ajoutée à votre plan d'action.`,
      relatedTo: {
        model: "ActionPlan",
        id: actionPlan._id,
      },
    })

    await notification.save()

    res.status(200).json(updatedActionPlan)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de la tâche", error: error.message })
  }
}

// Mettre à jour le statut d'une tâche
const updateTaskStatus = async (req, res) => {
  try {
    const { planId, taskId } = req.params
    const { status } = req.body

    const actionPlan = await ActionPlan.findById(planId)

    if (!actionPlan) {
      return res.status(404).json({ message: "Plan d'action non trouvé" })
    }

    // Trouver la tâche
    const taskIndex = actionPlan.tasks.findIndex((task) => task._id.toString() === taskId)

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Tâche non trouvée" })
    }

    // Mettre à jour le statut
    actionPlan.tasks[taskIndex].status = status

    // Si la tâche est marquée comme terminée, enregistrer la date
    if (status === "termine") {
      actionPlan.tasks[taskIndex].completedAt = new Date()

      // Créer une notification pour le coach
      const notification = new Notification({
        recipient: actionPlan.coachId,
        sender: req.user.id,
        type: "task_completed",
        title: "Tâche terminée",
        message: `La tâche "${actionPlan.tasks[taskIndex].title}" a été marquée comme terminée.`,
        relatedTo: {
          model: "ActionPlan",
          id: actionPlan._id,
        },
      })

      await notification.save()
    }

    const updatedActionPlan = await actionPlan.save()

    res.status(200).json(updatedActionPlan)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche", error: error.message })
  }
}

module.exports = {
  createActionPlan,
  getUserActionPlans,
  getCoachActionPlans,
  getActionPlan,
  updateActionPlan,
  addTask,
  updateTaskStatus,
}

