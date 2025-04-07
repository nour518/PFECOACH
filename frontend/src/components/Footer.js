// src/components/Footer.js
import React from "react";
import "../footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Votre entreprise. Tous droits réservés.</p>
        <p>
          <a href="/contact" className="footer-link">Contact</a> | 
          <a href="/terms" className="footer-link">Mentions légales</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
