"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordErrors, setPasswordErrors] = useState({
    uppercase: true,
    lowercase: true,
    number: true,
    special: true,
    length: true,
  })
  const navigate = useNavigate()

  // Valider le mot de passe à chaque changement
  useEffect(() => {
    validatePassword(formData.password)
  }, [formData.password])

  const validatePassword = (password) => {
    setPasswordErrors({
      uppercase: !/[A-Z]/.test(password),
      lowercase: !/[a-z]/.test(password),
      number: !/[0-9]/.test(password),
      special: !/[^A-Za-z0-9]/.test(password),
      length: password.length < 8,
    })
  }

  const isPasswordValid = () => {
    return !Object.values(passwordErrors).some((error) => error)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  // Remplacez la fonction handleSubmit par celle-ci pour obtenir plus de détails sur l'erreur
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validation basique de l'email avant soumission
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setLoading(false)
      return setError("L'email n'est pas valide")
    }

    // Validation complète du mot de passe avant soumission
    if (!isPasswordValid()) {
      setLoading(false)
      return setError(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial, et faire au moins 8 caractères.",
      )
    }

    try {
      console.log("Données envoyées:", formData)

      const response = await fetch("http://localhost:5002/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("Réponse complète du serveur:", data)

      if (!response.ok) {
        // Afficher les détails de l'erreur si disponibles
        if (data.message) {
          throw new Error(data.message)
        } else if (data.error) {
          throw new Error(data.error)
        } else if (typeof data === "string") {
          throw new Error(data)
        } else {
          throw new Error("Erreur lors de l'inscription")
        }
      }

      console.log("Inscription réussie:", data)
      navigate("/login")
    } catch (err) {
      console.error("Erreur détaillée:", err)
      setError(err.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <h2>Inscription</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom complet</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          {/* Indicateurs de validation du mot de passe */}
          <div className="password-requirements" style={{ fontSize: "0.8rem", marginTop: "5px" }}>
            <p style={{ marginBottom: "5px" }}>Le mot de passe doit contenir :</p>
            <ul style={{ paddingLeft: "20px", margin: "0" }}>
              <li style={{ color: passwordErrors.length ? "red" : "green" }}>Au moins 8 caractères</li>
              <li style={{ color: passwordErrors.uppercase ? "red" : "green" }}>Au moins une lettre majuscule</li>
              <li style={{ color: passwordErrors.lowercase ? "red" : "green" }}>Au moins une lettre minuscule</li>
              <li style={{ color: passwordErrors.number ? "red" : "green" }}>Au moins un chiffre</li>
              <li style={{ color: passwordErrors.special ? "red" : "green" }}>Au moins un caractère spécial</li>
            </ul>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isPasswordValid()}
          style={{
            opacity: !isPasswordValid() || loading ? 0.7 : 1,
            cursor: !isPasswordValid() || loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Chargement..." : "S'inscrire"}
        </button>
      </form>
    </div>
  )
}

export default Signup

