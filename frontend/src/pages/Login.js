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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Réinitialiser les messages d'erreur
    setSuccess(""); // Réinitialiser les messages de succès
    setIsLoading(true);

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
      
        if (data.user.role === "user") {
          navigate("/dashboard");
        } else if (data.user.role === "coach") {
          navigate("/coachdashboard");
        } else {
          navigate("/");
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