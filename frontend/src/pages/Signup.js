import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importez useNavigate
import "../styles.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');  // Message d'erreur
  const [successMessage, setSuccessMessage] = useState(''); // Message de succès
  
  const navigate = useNavigate(); // Utilisation de useNavigate pour la redirection

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Réinitialiser les messages d'erreur à chaque soumission
    setSuccessMessage(''); // Réinitialiser le message de succès

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
        setSuccessMessage(data.message || "Inscription réussie !");
        setTimeout(() => {
          navigate('/login');  // Redirection vers la page de connexion après succès
        }, 2000);
      } else {
        setErrorMessage(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error('Erreur :', error);
      setErrorMessage("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="signup-container">
      <h1>Créer un compte</h1> {/* Titre principal */}
      <p className="signup-description">Entrez vos informations pour créer votre compte</p> {/* Description */}

      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Affichage des erreurs */}
      {successMessage && <div className="success-message">{successMessage}</div>} {/* Affichage du succès */}

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
