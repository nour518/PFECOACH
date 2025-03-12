"use client"
// Importez Link depuis react-router-dom v7
import { Link, useNavigate } from "react-router-dom"
// Pour HashLink, nous allons utiliser une approche différente
import "../styles.css"
import { useState, useEffect } from "react"

function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCoach, setIsCoach] = useState(false)

  // Vérifier si l'utilisateur est connecté au chargement du composant
  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))

    if (token && user) {
      setIsLoggedIn(true)
      // Vérifier si c'est le coach spécial ou un coach normal
      setIsCoach(user.role === "coach" || user.email === "sadek21@gmail.com")
    }
  }, [])

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setIsCoach(false)
    navigate("/")
  }

  // Fonction pour faire défiler vers une section
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <Link to="/" className="navbar-link">
            Accueil
          </Link>
        </li>
        <li>
          <Link to="/contact" className="navbar-link">
            Contact
          </Link>
        </li>
        <li>
          <Link to="/diagnostic" className="navbar-link">
            Diagnostic
          </Link>
        </li>

        {/* Remplacez HashLink par un Link avec onClick */}
        <li>
          <Link
            to="/"
            className="coach-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("coaches")
            }}
          >
            Nos Coachs
          </Link>
        </li>
        <li>
          <Link to="/demo" className="demo-link">
            Demander une Démo
          </Link>
        </li>

        {isLoggedIn ? (
          <>
            {isCoach && (
              <li>
                <Link to="/coach-dashboard" className="navbar-link">
                  Dashboard Coach
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="logout-button">
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup" className="navbar-link">
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/login" className="navbar-link">
                Sign In
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar

