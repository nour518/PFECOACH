const User = require("../models/User")
const Diagnostic = require("../models/diagnostic")
const ActionPlan = require("../models/ActionPlan")

// Statistiques pour le dashboard admin
const getAdminStats = async (req, res) => {
  try {
    // Nombre total d'utilisateurs par rôle
    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ])

    // Convertir en objet pour faciliter l'utilisation
    const userCounts = userStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count
      return acc
    }, {})

    // Nombre de diagnostics par statut
    const diagnosticStats = await Diagnostic.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    // Convertir en objet
    const diagnosticCounts = diagnosticStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count
      return acc
    }, {})

    // Nombre de plans d'action par statut
    const actionPlanStats = await ActionPlan.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    // Convertir en objet
    const actionPlanCounts = actionPlanStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count
      return acc
    }, {})

    // Statistiques par mois (diagnostics créés)
    const diagnosticsByMonth = await Diagnostic.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    // Formater les données pour le graphique
    const monthlyDiagnostics = diagnosticsByMonth.map((item) => ({
      date: `${item._id.year}-${item._id.month.toString().padStart(2, "0")}`,
      count: item.count,
    }))

    res.status(200).json({
      users: userCounts,
      diagnostics: diagnosticCounts,
      actionPlans: actionPlanCounts,
      monthlyDiagnostics,
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques", error: error.message })
  }
}

// Statistiques pour le dashboard coach
const getCoachStats = async (req, res) => {
  try {
    const coachId = req.user.id

    // Nombre d'utilisateurs suivis par ce coach
    const userCount = await ActionPlan.distinct("userId", { coachId }).countDocuments()

    // Nombre de diagnostics revus par ce coach
    const diagnosticCount = await Diagnostic.countDocuments({ reviewedBy: coachId })

    // Nombre de plans d'action créés par ce coach
    const actionPlanCount = await ActionPlan.countDocuments({ coachId })

    // Tâches par statut
    const taskStats = await ActionPlan.aggregate([
      { $match: { coachId: coachId } },
      { $unwind: "$tasks" },
      {
        $group: {
          _id: "$tasks.status",
          count: { $sum: 1 },
        },
      },
    ])

    // Convertir en objet
    const taskCounts = taskStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count
      return acc
    }, {})

    // Diagnostics par statut
    const diagnosticStats = await Diagnostic.aggregate([
      { $match: { reviewedBy: coachId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    // Convertir en objet
    const diagnosticCounts = diagnosticStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count
      return acc
    }, {})

    res.status(200).json({
      userCount,
      diagnosticCount,
      actionPlanCount,
      tasks: taskCounts,
      diagnostics: diagnosticCounts,
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques", error: error.message })
  }
}

module.exports = {
  getAdminStats,
  getCoachStats,
}

