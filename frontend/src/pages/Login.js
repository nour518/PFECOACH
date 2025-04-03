"use client";

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getRedirectPath = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("redirect") || "/";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Réinitialiser les messages d'erreur
    setSuccess(""); // Réinitialiser les messages de succès
    setIsLoading(true);
=======
 // Dans votre composant Login.js
 const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost:5002/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm // Ajoutez cette ligne si votre backend la demande
      }),
    });
>>>>>>> 6794824 (Ajout du code)

    const data = await response.json();

<<<<<<< HEAD
      // Créer un objet utilisateur coach avec abonnement
      const coachUser = {
        id: "coach123",
        name: "Sadek Coach",
        email: "sadek21@gmail.com",
        role: "coach",
        subscription: {
          isSubscribed: true,
          plan: "premium",
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        },
      };

      // Stocker les informations du coach dans localStorage
      localStorage.setItem("token", "coach_token_123456");
      localStorage.setItem("user", JSON.stringify(coachUser));

      // Rediriger vers la page appropriée
      const redirectPath = getRedirectPath();
      if (redirectPath === "subscription") {
        navigate("/planaction");
      } else {
        navigate("/coach-dashboard");
      }
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5002/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); 

      if (response.ok) {
        setSuccess("Connexion réussie !");

        // Ajouter un abonnement fictif pour la démo
        if (data.user) {
          data.user.subscription = {
            isSubscribed: true,
            plan: "basic",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          };
        }

        // Stocker le token et les informations utilisateur dans localStorage
        if (data.token && data.user) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Rediriger vers la page appropriée
        const redirectPath = getRedirectPath();
        if (redirectPath === "subscription") {
          navigate("/planaction");
        } else if (data.user.role === "coach") {
          navigate("/coach-dashboard");
        } else {
          navigate(redirectPath);
        }
      } else {
        setError(data.message || "Une erreur s'est produite lors de la connexion.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };
=======
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'inscription');
    }

    console.log('Inscription réussie:', data);
    // Redirection ou traitement du succès ici
    
  } catch (error) {
    console.error('Erreur complète:', error);
    setError(error.message || 'Erreur technique lors de l\'inscription');
  }
};
(Ajout du code)

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
            autoComplete="username"
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
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
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