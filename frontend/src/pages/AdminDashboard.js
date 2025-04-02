"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import StatsDashboard from "../components/StatsDashboard"
import "../styles.css"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats")
  const [users, setUsers] = useState([])
  const [coaches, setCoaches] = useState([])
  const [tests, setTests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Vérification admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || user.role !== "admin") {
      navigate("/login")
    }
  }, [navigate])

  // Données mockées pour la démo
  useEffect(() => {
    setUsers([
      { id: 1, name: "User 1", email: "user1@example.com", role: "user" },
      { id: 2, name: "User 2", email: "user2@example.com", role: "user" },
      { id: 3, name: "User 3", email: "user3@example.com", role: "user" },
      { id: 4, name: "User 4", email: "user4@example.com", role: "user" },
    ])

    setCoaches([
      { id: 1, name: "Coach 1", email: "coach1@example.com", speciality: "Life Coaching" },
      { id: 2, name: "Coach 2", email: "coach2@example.com", speciality: "Career Coaching" },
      { id: 3, name: "Sadek Coach", email: "sadek21@gmail.com", speciality: "Personal Development" },
    ])

    setTests([
      { id: 1, title: "Test de personnalité", questions: 10 },
      { id: 2, title: "Test de stress", questions: 15 },
      { id: 3, title: "Test de satisfaction professionnelle", questions: 12 },
    ])

    setIsLoading(false)
  }, [])

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleDeleteCoach = (coachId) => {
    setCoaches(coaches.filter((coach) => coach.id !== coachId))
  }

  const handleDeleteTest = (testId) => {
    setTests(tests.filter((test) => test.id !== testId))
  }

  const handleAddCoach = () => {
    navigate("/admin/add-coach")
  }

  const handleManageTests = () => {
    navigate("/test-management")
  }

  if (isLoading) return <div className="loading">Chargement...</div>

  return (
    <div className="admin-dashboard">
      <h1>Dashboard Administrateur</h1>

      <div className="admin-tabs">
        <button className={`tab-button ${activeTab === "stats" ? "active" : ""}`} onClick={() => setActiveTab("stats")}>
          Statistiques
        </button>
        <button className={`tab-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          Utilisateurs
        </button>
        <button
          className={`tab-button ${activeTab === "coaches" ? "active" : ""}`}
          onClick={() => setActiveTab("coaches")}
        >
          Coachs
        </button>
        <button className={`tab-button ${activeTab === "tests" ? "active" : ""}`} onClick={() => setActiveTab("tests")}>
          Tests
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "stats" && <StatsDashboard userRole="admin" />}

        {activeTab === "users" && (
          <div className="users-section">
            <h2>Gestion des Utilisateurs</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button onClick={() => handleDeleteUser(user.id)} className="delete-button">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "coaches" && (
          <div className="coaches-section">
            <h2>Gestion des Coachs</h2>
            <button onClick={handleAddCoach} className="add-button">
              Ajouter un Coach
            </button>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Spécialité</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coaches.map((coach) => (
                    <tr key={coach.id}>
                      <td>{coach.name}</td>
                      <td>{coach.email}</td>
                      <td>{coach.speciality}</td>
                      <td>
                        <button onClick={() => handleDeleteCoach(coach.id)} className="delete-button">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "tests" && (
          <div className="tests-section">
            <h2>Gestion des Tests</h2>
            <button onClick={handleManageTests} className="add-button">
              Gérer les Tests
            </button>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Questions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test) => (
                    <tr key={test.id}>
                      <td>{test.title}</td>
                      <td>{test.questions}</td>
                      <td>
                        <button onClick={() => handleDeleteTest(test.id)} className="delete-button">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard

