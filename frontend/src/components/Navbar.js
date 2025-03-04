// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/" className="navbar-link">Accueil</Link></li>
        <li><Link to="/contact" className="navbar-link">Contact</Link></li>
        <li><Link to="/diagnostic" className="navbar-link">Diagnostic</Link></li>
        <li><Link to="#coaches" className="navbar-link">Nos Coachs</Link></li> {/* Lien vers Nos Coachs */}
      </ul>
    </nav>
  );
}

export default Navbar;
