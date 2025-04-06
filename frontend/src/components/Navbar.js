"use client"

import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "../styles.css"

function Navbar() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Vérifier si l'utilisateur est connecté (en surveillant localStorage)
  const checkUser = () => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user) // !! converts to true/false
  }

  useEffect(() => {
    checkUser()

    // Optionally listen to storage changes (from other tabs)
    const handleStorageChange = () => {
      checkUser()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  })

  // Fonction pour faire défiler vers une section
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    navigate("/")
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
            <li>
              <Link to="/dashboard" className="navbar-link">
                Tableau de bord
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="navbar-link logout-link">
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