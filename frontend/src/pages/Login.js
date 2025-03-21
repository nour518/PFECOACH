"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles.css"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("") // État pour les messages d'erreur
  const [success, setSuccess] = useState("") // État pour les messages de succès
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("") // Réinitialiser les messages d'erreur
    setSuccess("") // Réinitialiser les messages de succès
    setIsLoading(true)

    // Vérification spécifique pour le compte coach
    if (formData.email === "sadek21@gmail.com" && formData.password === "123456") {
      setSuccess("Connexion réussie en tant que coach !")

      // Créer un objet utilisateur coach
      const coachUser = {
        id: "coach123",
        name: "Sadek Coach",
        email: "sadek21@gmail.com",
        role: "coach",
      }

      // Stocker les informations du coach dans localStorage
      localStorage.setItem("token", "coach_token_123456")
      localStorage.setItem("user", JSON.stringify(coachUser))

      // Rediriger vers le tableau de bord coach
      navigate("/coach-dashboard")
      return
    }

    try {
      const response = await fetch("http://localhost:5002/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message) // Affichez un message de succès

        // Stocker le token et les informations utilisateur dans localStorage
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        // Rediriger vers le tableau de bord approprié
        if (data.user.role === "coach") {
          navigate("/coach-dashboard")
        } else {
          navigate("/")
        }
      } else {
        setError(data.message) // Affichez un message d'erreur
      }
    } catch (error) {
      console.error("Erreur :", error)
      setError("Une erreur s'est produite. Veuillez réessayer plus tard.")
    } finally {
      setIsLoading(false)
    }
  }

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
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Mot de passe :</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
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
  )
}

export default Login

