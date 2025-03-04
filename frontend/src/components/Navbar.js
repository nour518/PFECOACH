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
        <li><Link to="/demo" className="demo-link">Demander une Démo</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
