"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles.css"

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

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
        setSuccess(data.message)

        // Stocker les informations de l'utilisateur et le token dans localStorage
        const userData = {
          ...data.user,
          token: data.token,
        }
        localStorage.setItem("user", JSON.stringify(userData))

        // Rediriger vers le tableau de bord après une courte pause
        setTimeout(() => {
          navigate("/dashboard")
        }, 1000)
      } else {
        setError(data.message)
      }
    } catch (error) {
      console.error("Erreur :", error)
      setError("Une erreur s'est produite. Veuillez réessayer plus tard.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      <p className="login-description">Entrez vos identifiants pour vous connecter</p>

      {success && <div className="success-message">{success}</div>}
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
  )
}

export default Login

