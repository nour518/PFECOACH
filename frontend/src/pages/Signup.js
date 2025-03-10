import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importez Link pour la navigation
import "../styles.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5002/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Affichez un message de succès
      } else {
        alert(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error('Erreur :', error);
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="signup-container">
      <h1>Créer un compte</h1> {/* Titre principal */}
      <p className="signup-description">Entrez vos informations pour créer votre compte</p> {/* Description */}
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label>Nom :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      <p className="login-link">
        Vous avez déjà un compte ? <Link to="/login">Se connecter</Link> {/* Lien vers la page de connexion */}
      </p>
    </div>
  );
};

export default Signup;