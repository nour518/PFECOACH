"use client";

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles.css";

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
<<<<<<< HEAD
  });
  const [error, setError] = useState(""); // État pour les messages d'erreur
  const [success, setSuccess] = useState(""); // État pour les messages de succès
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Ajouter cette ligne pour accéder aux paramètres d'URL

  // Fonction pour obtenir les paramètres d'URL
  const getRedirectPath = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("redirect") || "/";
  };
=======
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
<<<<<<< HEAD
    e.preventDefault();
    setError(""); // Réinitialiser les messages d'erreur
    setSuccess(""); // Réinitialiser les messages de succès
    setIsLoading(true);

    // Vérification spécifique pour le compte coach
    if (formData.email === "sadek21@gmail.com" && formData.password === "123456") {
      setSuccess("Connexion réussie en tant que coach !");

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
      return;
    }
=======
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80

    try {
      const response = await fetch("http://localhost:5002/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Correction ici, remplace "ressponse" par "response"
      const data = await response.json(); 

      if (response.ok) {
<<<<<<< HEAD
        setSuccess(data.message); // Affichez un message de succès

        // Ajouter un abonnement fictif pour la démo
        if (data.user) {
          data.user.subscription = {
            isSubscribed: true,
            plan: "basic",
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          };
        }

        // Stocker le token et les informations utilisateur dans localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Rediriger vers la page appropriée
        const redirectPath = getRedirectPath();
        if (redirectPath === "subscription") {
          navigate("/planaction");
        } else if (data.user.role === "coach") {
          navigate("/coach-dashboard");
        } else {
          navigate(redirectPath);
=======
        setSuccess(data.message)

        // Stocker les informations de l'utilisateur et le token dans localStorage
        const userData = {
          ...data.user,
          token: data.token,
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
        }
        localStorage.setItem("user", JSON.stringify(userData))

        // Rediriger vers le tableau de bord après une courte pause
        setTimeout(() => {
          navigate("/dashboard")
        }, 1000)
      } else {
<<<<<<< HEAD
        setError(data.message); // Affichez un message d'erreur
=======
        setError(data.message)
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
      }
    } catch (error) {
      console.error("Erreur :", error);
      setError("Une erreur s'est produite. Veuillez réessayer plus tard.");
    } finally {
<<<<<<< HEAD
      setIsLoading(false);
=======
      setLoading(false)
>>>>>>> 873df53fabf76eacd26c160c16e45582903d1b80
    }
  };

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      <p className="login-description">Entrez vos identifiants pour vous connecter</p>

      {success && <div className="success-message">{success}</div>}
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
        <button type="submit" disabled={loading}>
          {loading ? "Connexion en cours..." : "Se connecter"}
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
