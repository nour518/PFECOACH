// routes/coachRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { isCoach } = require("../middleware/roleMiddleware");
const {
  addCoach,
  getAllCoaches,
  getCoachById,
  updateCoach,
  deleteCoach,
} = require("../controllers/coachController");

// Route pour ajouter un coach
router.post("/", protect, isCoach, addCoach);

// Route pour récupérer tous les coachs
router.get("/", protect, isCoach, getAllCoaches);

// Route pour récupérer un coach par ID
router.get("/:id", protect, isCoach, getCoachById);

// Route pour mettre à jour un coach
router.put("/:id", protect, isCoach, updateCoach);

// Route pour supprimer un coach
router.delete("/:id", protect, isCoach, deleteCoach);

module.exports = router;
