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

// Route pour récupérer les abonnés du coach
router.get("/:coachId/subscribers", async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.coachId).populate("subscribers", "name email subscriptionStatus subscriptionDate");
    if (!coach) {
      return res.status(404).json({ message: "Coach non trouvé." });
    }
    res.status(200).json(coach.subscribers);  // Retourne la liste des abonnés
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnés", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Autres routes pour la gestion des coachs
router.post("/add", protect, checkRole("admin"), addCoach)
router.get("/", protect, getAllCoaches)
router.get("/:id", protect, getCoachById)
router.put("/:id", protect, updateCoach)
router.delete("/:id", protect, checkRole("admin"), deleteCoach)

module.exports = router