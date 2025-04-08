const express = require("express")
const router = express.Router()
const {
  createActionPlan,
  getUserActionPlans,
  getActionPlan,
  updateActionPlan,
  deleteActionPlan,
  getAllActionPlans,
  addProgressUpdate,
} = require("../controllers/actionPlanController")
const { protect } = require("../middleware/authMiddleware")
const { isCoach } = require("../middleware/roleMiddleware")

// Routes protégées
router.use(protect)

// Routes pour tous les utilisateurs
router.get("/user/:userId", getUserActionPlans)
router.get("/:id", getActionPlan)
router.post("/:id/progress", addProgressUpdate)
router.put("/:id", updateActionPlan)

// Routes pour les coachs
router.post("/", isCoach, createActionPlan)
router.delete("/:id", isCoach, deleteActionPlan)
router.get("/", isCoach, getAllActionPlans)

module.exports = router
