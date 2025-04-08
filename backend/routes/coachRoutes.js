const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getCoachAbonnees } = require("../controllers/coachController");

// Route pour récupérer les abonnés d’un coach (ex: GET /api/coaches/:coachId/abonnees)
router.get("/:coachId/abonnees", protect, getCoachAbonnees);

module.exports = router;
