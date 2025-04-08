const express = require("express")
const router = express.Router()
const {
  sendMessage,
  getMessages,
  getConversations,
  getConversation,
  markAsRead,
} = require("../controllers/messageController")
const { protect } = require("../middleware/authMiddleware")

// Routes protégées
router.use(protect)

// Routes pour les messages
router.post("/", sendMessage)
router.get("/", getMessages)
router.get("/conversations", getConversations)
router.get("/conversation/:userId", getConversation)
router.put("/:id/read", markAsRead)

module.exports = router
