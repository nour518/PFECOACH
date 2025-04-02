const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const { isCoach } = require("../middleware/roleMiddleware")
const { getAllUsers } = require("../controllers/userController")
const Diagnostic = require("../models/Diagnostic") // Ajout de l'import manquant

// Route pour récupérer tous les utilisateurs (pour les coaches)
router.get("/users", protect, isCoach, getAllUsers)

// Route pour récupérer tous les diagnostics (pour les coaches)
router.get("/diagnostics", protect, isCoach, async (req, res) => {
  try {
    const diagnostics = await Diagnostic.find().populate("userId", "name email")
    res.status(200).json(diagnostics)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des diagnostics", error: error.message })
  }
})

// Route pour récupérer les diagnostics d'un utilisateur spécifique
router.get("/diagnostics/:userId", protect, isCoach, async (req, res) => {
  try {
    const { userId } = req.params
    const diagnostics = await Diagnostic.find({ userId }).populate("userId", "name email")
    res.status(200).json(diagnostics)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des diagnostics", error: error.message })
  }
})

module.exports = router

