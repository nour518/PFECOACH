const express = require("express")
const router = express.Router()
const messageController = require("../controllers/messageController")
const { protect } = require("../middleware/authMiddleware")

// Routes pour les messages
router.post("/", protect, messageController.createMessage)
router.post("/send", protect, messageController.createMessage) // Alias pour la compatibilité
router.get("/conversation/:userId", protect, messageController.getConversation)

module.exports = router

