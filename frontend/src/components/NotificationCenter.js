"use client"
import { useState, useEffect } from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import "../styles.css"

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")

      // Pour la démo, utiliser des données fictives
      if (!token) {
        setNotifications([])
        setUnreadCount(0)
        return
      }

      // Simuler des données pour la démo
      const mockNotifications = [
        {
          _id: "1",
          type: "diagnostic_approved",
          title: "Diagnostic approuvé",
          message: "Votre diagnostic a été approuvé par un coach.",
          read: false,
          createdAt: new Date(Date.now() - 3600000),
          sender: { name: "Coach Ahmed" },
        },
        {
          _id: "2",
          type: "task_assigned",
          title: "Nouvelle tâche assignée",
          message: 'Une nouvelle tâche "Méditation quotidienne" a été ajoutée à votre plan d\'action.',
          read: true,
          createdAt: new Date(Date.now() - 86400000),
          sender: { name: "Coach Sarah" },
        },
        {
          _id: "3",
          type: "diagnostic_modified",
          title: "Diagnostic modifié",
          message: "Votre diagnostic a été modifié par un coach.",
          read: false,
          createdAt: new Date(Date.now() - 172800000),
          sender: { name: "Coach Ahmed" },
        },
      ]

      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter((n) => !n.read).length)

      // Code pour l'API réelle (à décommenter quand l'API est prête)
      /*
      const response = await fetch("http://localhost:5002/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des notifications")
      }

      const data = await response.json()
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
      */
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Simuler la mise à jour pour la démo
      setNotifications(notifications.map((n) => (n._id === notificationId ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))

      // Code pour l'API réelle (à décommenter quand l'API est prête)
      /*
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5002/api/notifications/${notificationId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la notification")
      }

      fetchNotifications()
      */
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // Simuler la mise à jour pour la démo
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)

      // Code pour l'API réelle (à décommenter quand l'API est prête)
      /*
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5002/api/notifications/read-all", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des notifications")
      }

      fetchNotifications()
      */
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    try {
      // Simuler la suppression pour la démo
      setNotifications(notifications.filter((n) => n._id !== notificationId))
      setUnreadCount((prev) => prev - (notifications.find((n) => n._id === notificationId && !n.read) ? 1 : 0))

      // Code pour l'API réelle (à décommenter quand l'API est prête)
      /*
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5002/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la notification")
      }

      fetchNotifications()
      */
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const formatDate = (date) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffMs = now - notifDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? "s" : ""}`
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`
    } else {
      return `Il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "diagnostic_approved":
        return "✅"
      case "diagnostic_modified":
        return "📝"
      case "task_assigned":
        return "📋"
      case "task_completed":
        return "🏆"
      case "message":
        return "💬"
      default:
        return "🔔"
    }
  }

  return (
    <div className="notification-center">
      <button className="notification-button" onClick={() => setIsOpen(!isOpen)} aria-label="Notifications">
        <Bell size={20} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button className="mark-all-read-button" onClick={handleMarkAllAsRead}>
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="notification-list">
            {isLoading ? (
              <div className="notification-loading">Chargement...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification._id} className={`notification-item ${!notification.read ? "unread" : ""}`}>
                  <div className="notification-icon">{getNotificationIcon(notification.type)}</div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-meta">
                      {notification.sender && <span className="notification-sender">{notification.sender.name}</span>}
                      <span className="notification-time">{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>
                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        className="notification-action-button"
                        onClick={() => handleMarkAsRead(notification._id)}
                        aria-label="Marquer comme lu"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      className="notification-action-button"
                      onClick={() => handleDeleteNotification(notification._id)}
                      aria-label="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="notification-empty">Aucune notification</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationCenter

