import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(''); // État pour les messages d'erreur
  const [success, setSuccess] = useState(''); // État pour les messages de succès

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialiser les messages d'erreur
    setSuccess(''); // Réinitialiser les messages de succès

    try {
      const response = await fetch('http://localhost:5002/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message); // Affichez un message de succès
      } else {
        setError(data.message); // Affichez un message d'erreur
      }
    } catch (error) {
      console.error('Erreur :', error);
      setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      <p className="login-description">Entrez vos identifiants pour vous connecter</p>

      {/* Afficher le message de succès */}
      {success && <div className="success-message">{success}</div>}

      {/* Afficher le message d'erreur */}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="login-form">
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
        <button type="submit">Se connecter</button>
      </form>
      <p className="forgot-password">
        <Link to="/forgot-password">Mot de passe oublié ?</Link>
      </p>
      <p className="signup-link">
        Vous n'avez pas de compte ? <Link to="/signup">S'inscrire</Link>
      </p>
    </div>
  );
};

export default Login;