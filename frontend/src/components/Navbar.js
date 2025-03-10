"use client"
// Importez Link depuis react-router-dom v7
import { Link } from "react-router-dom"
// Pour HashLink, nous allons utiliser une approche différente
import "../styles.css"

function Navbar() {
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
          <Link to="/"className="navbar-link">Accueil</Link>
        </li>
        <li>
          <Link to="/contact"className="navbar-link">Contact</Link>
        </li>
        <li>
          <Link to="/diagnostic"className="navbar-link">Diagnostic</Link>
        </li>
       
        {/* Remplacez HashLink par un Link avec onClick */}
        <li>
          <Link
            to="/"className="coach-link"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection("coaches")
            }}
          >
            Nos Coachs
          </Link>
        </li>
        <li>
          <Link to="/demo"className="demo-link">Demander une Démo</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar

