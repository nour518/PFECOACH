const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController")

// Routes pour les notifications
router.get("/", protect, getUserNotifications)
router.put("/:notificationId/read", protect, markAsRead)
router.put("/read-all", protect, markAllAsRead)
router.delete("/:notificationId", protect, deleteNotification)

module.exports = router

