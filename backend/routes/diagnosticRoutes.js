const express = require("express")
const router = express.Router()
const {
  createDiagnostic,
  getUserDiagnostics,
  getDiagnostic,
  updateDiagnostic,
  deleteDiagnostic,
  getAllDiagnostics,
  validateDiagnostic,
} = require("../controllers/diagnosticController")
const { protect } = require("../middleware/authMiddleware")
const { isCoach } = require("../middleware/roleMiddleware")

// Routes protégées
router.use(protect)

// Routes pour tous les utilisateurs
router.get("/user/:userId", getUserDiagnostics)
router.get("/:id", getDiagnostic)

// Routes pour les coachs
router.post("/", isCoach, createDiagnostic)
router.put("/:id", isCoach, updateDiagnostic)
router.delete("/:id", isCoach, deleteDiagnostic)
router.get("/", isCoach, getAllDiagnostics)
router.put("/:id/validate", isCoach, validateDiagnostic)

module.exports = router
