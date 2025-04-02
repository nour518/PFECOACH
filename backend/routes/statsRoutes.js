const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const { isCoach, isAdmin } = require("../middleware/roleMiddleware")
const { getAdminStats, getCoachStats } = require("../controllers/statsController")

// Routes pour les statistiques
router.get("/admin", protect, isAdmin, getAdminStats)
router.get("/coach", protect, isCoach, getCoachStats)

module.exports = router

