"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles.css"

const CoachDashboard = () => {
  const [users, setUsers] = useState([])
  const [diagnostics, setDiagnostics] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userDiagnostics, setUserDiagnostics] = useState([])
  const [activeTab, setActiveTab] = useState("users")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Récupérer le token du localStorage
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté et est un coach
    if (!token || !user || user.role !== "coach") {
      navigate("/login")
      return
    }

    // Charger les données
    fetchData()
  }, [token, navigate, user])

  // Modifier la fonction fetchData pour gérer le cas spécial du coach sadek21@gmail.com
  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Vérifier si c'est le coach spécial (sadek21@gmail.com)
      if (user && user.email === "sadek21@gmail.com") {
        // Données fictives pour le coach sadek21@gmail.com
        const mockUsers = [
          { _id: "user1", name: "Ahmed Ben Ali", email: "ahmed@example.com" },
          { _id: "user2", name: "Fatima Zahra", email: "fatima@example.com" },
          { _id: "user3", name: "Mohamed Salah", email: "mohamed@example.com" },
          { _id: "user4", name: "Leila Trabelsi", email: "leila@example.com" },
          { _id: "user5", name: "Karim Benzema", email: "karim@example.com" },
        ]

        const mockDiagnostics = [
          {
            _id: "diag1",
            userId: { _id: "user1", name: "Ahmed Ben Ali", email: "ahmed@example.com" },
            diagnostic:
              "Vous avez besoin de travailler sur votre confiance en vous. Votre niveau de stress est élevé et cela affecte votre prise de décision.",
            date: new Date("2023-11-15"),
            responses: { stress: "élevé", confiance: "faible", motivation: "moyenne" },
          },
          {
            _id: "diag2",
            userId: { _id: "user2", name: "Fatima Zahra", email: "fatima@example.com" },
            diagnostic:
              "Votre équilibre vie professionnelle/vie personnelle est à améliorer. Vous montrez des signes d'épuisement professionnel.",
            date: new Date("2023-12-01"),
            responses: { stress: "moyen", confiance: "moyenne", motivation: "faible" },
          },
          {
            _id: "diag3",
            userId: { _id: "user3", name: "Mohamed Salah", email: "mohamed@example.com" },
            diagnostic:
              "Vous avez un excellent niveau de motivation mais vous pourriez améliorer votre gestion du temps pour éviter le surmenage.",
            date: new Date("2024-01-10"),
            responses: { stress: "moyen", confiance: "élevée", motivation: "élevée" },
          },
        ]

        setUsers(mockUsers)
        setDiagnostics(mockDiagnostics)
        return
      }

      // Si ce n'est pas le coach spécial, continuer avec le code existant
      // Récupérer la liste des utilisateurs
      const usersResponse = await fetch("http://localhost:5002/api/coach/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!usersResponse.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs")
      }

      const usersData = await usersResponse.json()
      setUsers(usersData)

      // Récupérer tous les diagnostics
      const diagnosticsResponse = await fetch("http://localhost:5002/api/coach/diagnostics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!diagnosticsResponse.ok) {
        throw new Error("Erreur lors de la récupération des diagnostics")
      }

      const diagnosticsData = await diagnosticsResponse.json()
      setDiagnostics(diagnosticsData)
    } catch (err) {
      setError(err.message)
      console.error("Erreur:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Modifier également la fonction handleUserSelect pour gérer le cas spécial
  const handleUserSelect = async (userId) => {
    setSelectedUser(userId)
    setIsLoading(true)
    try {
      // Vérifier si c'est le coach spécial (sadek21@gmail.com)
      if (user && user.email === "sadek21@gmail.com") {
        // Données fictives pour le coach sadek21@gmail.com
        const mockUserDiagnostics = diagnostics.filter((diag) => diag.userId._id === userId)
        setUserDiagnostics(mockUserDiagnostics)
        setIsLoading(false)
        return
      }

      // Si ce n'est pas le coach spécial, continuer avec le code existant
      const response = await fetch(`http://localhost:5002/api/coach/diagnostics/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des diagnostics de l'utilisateur")
      }

      const data = await response.json()
      setUserDiagnostics(data)
    } catch (err) {
      setError(err.message)
      console.error("Erreur:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="loading">Chargement...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="coach-dashboard">
      <h1>Tableau de Bord Coach</h1>

      <div className="dashboard-tabs">
        <button className={`tab-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          Utilisateurs
        </button>
        <button
          className={`tab-button ${activeTab === "diagnostics" ? "active" : ""}`}
          onClick={() => setActiveTab("diagnostics")}
        >
          Tous les Diagnostics
        </button>
      </div>

      {activeTab === "users" && (
        <div className="users-section">
          <h2>Liste des Utilisateurs</h2>
          <div className="users-container">
            <div className="users-list">
              <h3>Utilisateurs ({users.length})</h3>
              <ul>
                {users.map((user) => (
                  <li
                    key={user._id}
                    className={selectedUser === user._id ? "selected" : ""}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <strong>{user.name}</strong> - {user.email}
                  </li>
                ))}
              </ul>
            </div>

            {selectedUser && (
              <div className="user-diagnostics">
                <h3>Diagnostics de l'utilisateur</h3>
                {userDiagnostics.length > 0 ? (
                  <ul>
                    {userDiagnostics.map((diag) => (
                      <li key={diag._id} className="diagnostic-item">
                        <div className="diagnostic-date">{new Date(diag.date).toLocaleDateString()}</div>
                        <div className="diagnostic-content">
                          <h4>Diagnostic:</h4>
                          <p>{diag.diagnostic}</p>
                          <h4>Réponses:</h4>
                          <pre>{JSON.stringify(diag.responses, null, 2)}</pre>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun diagnostic disponible pour cet utilisateur.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "diagnostics" && (
        <div className="diagnostics-section">
          <h2>Tous les Diagnostics</h2>
          {diagnostics.length > 0 ? (
            <ul className="diagnostics-list">
              {diagnostics.map((diag) => (
                <li key={diag._id} className="diagnostic-item">
                  <div className="diagnostic-header">
                    <span className="diagnostic-user">
                      {diag.userId ? `${diag.userId.name} (${diag.userId.email})` : "Utilisateur inconnu"}
                    </span>
                    <span className="diagnostic-date">{new Date(diag.date).toLocaleDateString()}</span>
                  </div>
                  <div className="diagnostic-content">
                    <h4>Diagnostic:</h4>
                    <p>{diag.diagnostic}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun diagnostic disponible.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CoachDashboard

