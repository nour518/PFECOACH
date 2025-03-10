import React from "react";
import { useNavigate } from "react-router-dom"; // Pour la navigation

function Result() {
  const diagnostic = localStorage.getItem("diagnostic") || "Aucun diagnostic disponible.";
  const navigate = useNavigate(); // Hook pour la navigation

  // Fonction pour rediriger vers la page d'inscription
  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="container">
      <h2>Résultat du Test</h2>
      <p>{diagnostic}</p>
      
      {/* Bouton pour rediriger vers la page d'inscription */}
      <button onClick={handleSignUp} className="btn">
        S'inscrire pour recevoir un diagnostic personnalisé
      </button>
    </div>
  );
}

export default Result;
