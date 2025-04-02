const Notification = require("../models/Notification")

// Récupérer les notifications d'un utilisateur
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id
    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "name email")
      .sort({ createdAt: -1 })

    res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des notifications", error: error.message })
  }
}

// Marquer une notification comme lue
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params
    const userId = req.user.id

    const notification = await Notification.findById(notificationId)

    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" })
    }

    // Vérifier que l'utilisateur est bien le destinataire
    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette notification" })
    }

    notification.read = true
    const updatedNotification = await notification.save()

    res.status(200).json(updatedNotification)
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la notification", error: error.message })
  }
}

// Marquer toutes les notifications comme lues
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id

    await Notification.updateMany({ recipient: userId, read: false }, { $set: { read: true } })

    res.status(200).json({ message: "Toutes les notifications ont été marquées comme lues" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour des notifications", error: error.message })
  }
}

// Supprimer une notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params
    const userId = req.user.id

    const notification = await Notification.findById(notificationId)

    if (!notification) {
      return res.status(404).json({ message: "Notification non trouvée" })
    }

    // Vérifier que l'utilisateur est bien le destinataire
    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette notification" })
    }

    await notification.deleteOne()

    res.status(200).json({ message: "Notification supprimée avec succès" })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la notification", error: error.message })
  }
}

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
}

