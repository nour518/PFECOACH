const express = require("express")
const router = express.Router()
const diagnosticController = require("../controllers/diagnosticController")
const { protect } = require("../middleware/authMiddleware")

// Routes protégées par l'authentification
router.get("/diagnostic/:userId", protect, diagnosticController.getDiagnostic)
router.post("/diagnostic", protect, diagnosticController.createDiagnostic)

module.exports = router

