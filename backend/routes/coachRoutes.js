const express = require("express")
const router = express.Router()
const {
  addCoach,
  login,
  getAllCoaches,
  getCoachById,
  updateCoach,
  deleteCoach,
  createSpecificCoach,
} = require("../controllers/coachController")
const { protect } = require("../middleware/authMiddleware")
const checkRole = require("../middleware/checkRole")

// Route de connexion
router.post("/login", login)

// Route pour créer le coach spécifique
router.post("/create-specific-coach", createSpecificCoach)

// Autres routes pour la gestion des coachs
router.post("/add", protect, checkRole("admin"), addCoach)
router.get("/", protect, getAllCoaches)
router.get("/:id", protect, getCoachById)
router.put("/:id", protect, updateCoach)
router.delete("/:id", protect, checkRole("admin"), deleteCoach)

module.exports = router

