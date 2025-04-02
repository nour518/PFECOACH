"use client"
import { useState, useEffect } from "react"
import "../styles.css"

const StatsDashboard = ({ userRole }) => {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [userRole])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      // Simuler des données pour la démo
      if (userRole === "admin") {
        const mockAdminStats = {
          users: {
            user: 45,
            coach: 8,
            admin: 2,
          },
          diagnostics: {
            pending: 23,
            approved: 67,
            modified: 15,
          },
          actionPlans: {
            active: 42,
            completed: 31,
            archived: 12,
          },
          monthlyDiagnostics: [
            { date: "2024-01", count: 12 },
            { date: "2024-02", count: 18 },
            { date: "2024-03", count: 25 },
            { date: "2024-04", count: 20 },
            { date: "2024-05", count: 30 },
          ],
        }
        setStats(mockAdminStats)
      } else if (userRole === "coach") {
        const mockCoachStats = {
          userCount: 12,
          diagnosticCount: 35,
          actionPlanCount: 18,
          tasks: {
            a_faire: 24,
            en_cours: 15,
            termine: 42,
          },
          diagnostics: {
            approved: 28,
            modified: 7,
          },
        }
        setStats(mockCoachStats)
      }

      // Code pour l'API réelle (à décommenter quand l'API est prête)
      /*
      const token = localStorage.getItem("token")
      const endpoint = userRole === "admin" ? "admin" : "coach"
      
      const response = await fetch(`http://localhost:5002/api/stats/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des statistiques")
      }

      const data = await response.json()
      setStats(data)
      */
    } catch (error) {
      console.error("Erreur:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="stats-loading">Chargement des statistiques...</div>
  }

  if (error) {
    return <div className="stats-error">Erreur: {error}</div>
  }

  if (!stats) {
    return <div className="stats-empty">Aucune statistique disponible</div>
  }

  return (
    <div className="stats-dashboard">
      <h2>Tableau de bord statistique</h2>

      {userRole === "admin" && (
        <>
          <div className="stats-grid">
            <div className="stats-card">
              <h3>Utilisateurs</h3>
              <div className="stats-numbers">
                <div className="stat-item">
                  <span className="stat-value">{stats.users.user || 0}</span>
                  <span className="stat-label">Utilisateurs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.users.coach || 0}</span>
                  <span className="stat-label">Coachs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.users.admin || 0}</span>
                  <span className="stat-label">Admins</span>
                </div>
              </div>
            </div>

            <div className="stats-card">
              <h3>Diagnostics</h3>
              <div className="stats-numbers">
                <div className="stat-item">
                  <span className="stat-value">{stats.diagnostics.pending || 0}</span>
                  <span className="stat-label">En attente</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.diagnostics.approved || 0}</span>
                  <span className="stat-label">Approuvés</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.diagnostics.modified || 0}</span>
                  <span className="stat-label">Modifiés</span>
                </div>
              </div>
            </div>

            <div className="stats-card">
              <h3>Plans d'action</h3>
              <div className="stats-numbers">
                <div className="stat-item">
                  <span className="stat-value">{stats.actionPlans.active || 0}</span>
                  <span className="stat-label">Actifs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.actionPlans.completed || 0}</span>
                  <span className="stat-label">Terminés</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.actionPlans.archived || 0}</span>
                  <span className="stat-label">Archivés</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-chart-container">
            <h3>Diagnostics par mois</h3>
            <div className="stats-chart">
              {stats.monthlyDiagnostics.map((item, index) => (
                <div key={index} className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(item.count / Math.max(...stats.monthlyDiagnostics.map((d) => d.count))) * 200}px`,
                    }}
                  >
                    <span className="chart-value">{item.count}</span>
                  </div>
                  <span className="chart-label">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {userRole === "coach" && (
        <>
          <div className="stats-grid">
            <div className="stats-card">
              <h3>Aperçu</h3>
              <div className="stats-numbers">
                <div className="stat-item">
                  <span className="stat-value">{stats.userCount || 0}</span>
                  <span className="stat-label">Utilisateurs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.diagnosticCount || 0}</span>
                  <span className="stat-label">Diagnostics</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.actionPlanCount || 0}</span>
                  <span className="stat-label">Plans d'action</span>
                </div>
              </div>
            </div>

            <div className="stats-card">
              <h3>Tâches</h3>
              <div className="stats-numbers">
                <div className="stat-item">
                  <span className="stat-value">{stats.tasks.a_faire || 0}</span>
                  <span className="stat-label">À faire</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.tasks.en_cours || 0}</span>
                  <span className="stat-label">En cours</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.tasks.termine || 0}</span>
                  <span className="stat-label">Terminées</span>
                </div>
              </div>
            </div>

            <div className="stats-card">
              <h3>Diagnostics</h3>
              <div className="stats-numbers">
                <div className="stat-item">
                  <span className="stat-value">{stats.diagnostics.approved || 0}</span>
                  <span className="stat-label">Approuvés</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{stats.diagnostics.modified || 0}</span>
                  <span className="stat-label">Modifiés</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-chart-container">
            <h3>Répartition des tâches</h3>
            <div className="stats-pie-chart">
              <div className="pie-chart">
                <div
                  className="pie-segment a-faire"
                  style={{
                    transform: `rotate(0deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((2 * Math.PI * stats.tasks.a_faire) / (stats.tasks.a_faire + stats.tasks.en_cours + stats.tasks.termine))}% ${50 - 50 * Math.sin((2 * Math.PI * stats.tasks.a_faire) / (stats.tasks.a_faire + stats.tasks.en_cours + stats.tasks.termine))}%, 50% 50%)`,
                  }}
                ></div>
                <div
                  className="pie-segment en-cours"
                  style={{
                    transform: `rotate(${(360 * stats.tasks.a_faire) / (stats.tasks.a_faire + stats.tasks.en_cours + stats.tasks.termine)}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((2 * Math.PI * stats.tasks.en_cours) / (stats.tasks.a_faire + stats.tasks.en_cours + stats.tasks.termine))}% ${50 - 50 * Math.sin((2 * Math.PI * stats.tasks.en_cours) / (stats.tasks.a_faire + stats.tasks.en_cours + stats.tasks.termine))}%, 50% 50%)`,
                  }}
                ></div>
                <div
                  className="pie-segment termine"
                  style={{
                    transform: `rotate(${(360 * (stats.tasks.a_faire + stats.tasks.en_cours)) / (stats.tasks.a_faire + stats.tasks.en_cours + stats.tasks.termine)}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 50%)`,
                  }}
                ></div>
              </div>
              <div className="pie-legend">
                <div className="legend-item">
                  <span className="legend-color a-faire"></span>
                  <span className="legend-label">À faire ({stats.tasks.a_faire})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color en-cours"></span>
                  <span className="legend-label">En cours ({stats.tasks.en_cours})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color termine"></span>
                  <span className="legend-label">Terminées ({stats.tasks.termine})</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default StatsDashboard

