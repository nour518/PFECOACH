const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const { isCoach } = require("../middleware/roleMiddleware")
const {
  createActionPlan,
  getUserActionPlans,
  getCoachActionPlans,
  getActionPlan,
  updateActionPlan,
  addTask,
  updateTaskStatus,
} = require("../controllers/actionPlanController")

// Routes pour les coachs
router.post("/", protect, isCoach, createActionPlan)
router.get("/coach", protect, isCoach, getCoachActionPlans)
router.put("/:planId", protect, isCoach, updateActionPlan)
router.post("/:planId/tasks", protect, isCoach, addTask)

// Routes pour les utilisateurs et coachs
router.get("/user/:userId", protect, getUserActionPlans)
router.get("/:planId", protect, getActionPlan)
router.put("/:planId/tasks/:taskId", protect, updateTaskStatus)

module.exports = router

