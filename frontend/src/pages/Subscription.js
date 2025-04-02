"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles.css"

const Subscription = () => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Plans d'abonnement
  const plans = [
    {
      id: "basic",
      name: "Basique",
      price: "9,99€",
      period: "par mois",
      features: [
        "Plans d'action personnalisés",
        "1 diagnostic par mois",
        "Accès aux ressources de base",
        "Support par email",
      ],
      recommended: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: "19,99€",
      period: "par mois",
      features: [
        "Plans d'action personnalisés",
        "Diagnostics illimités",
        "Accès à toutes les ressources",
        "2 sessions avec un coach par mois",
        "Support prioritaire",
      ],
      recommended: true,
    },
    {
      id: "annual",
      name: "Annuel",
      price: "199,99€",
      period: "par an",
      features: [
        "Tous les avantages Premium",
        "2 mois gratuits",
        "4 sessions avec un coach par mois",
        "Accès aux webinaires exclusifs",
      ],
      recommended: false,
    },
  ]

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (token && user) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId)
  }

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError("Veuillez sélectionner un plan d'abonnement")
      return
    }

    if (!isLoggedIn) {
      // Rediriger vers la page de connexion avec un paramètre pour revenir ici après
      navigate("/login?redirect=subscription")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Simuler un appel API pour l'abonnement
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simuler une mise à jour du statut d'abonnement de l'utilisateur
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      user.subscription = {
        isSubscribed: true,
        plan: selectedPlan,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      }
      localStorage.setItem("user", JSON.stringify(user))

      setSuccess("Félicitations ! Votre abonnement a été activé avec succès.")

      // Rediriger vers le plan d'action après 2 secondes
      setTimeout(() => {
        navigate("/planaction")
      }, 2000)
    } catch (error) {
      setError("Une erreur est survenue lors de l'abonnement. Veuillez réessayer.")
      console.error("Erreur d'abonnement:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        <h1>Choisissez votre plan d'abonnement</h1>
        <p className="subscription-description">
          Débloquez tout le potentiel de notre plateforme avec un abonnement adapté à vos besoins.
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="plans-container">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${selectedPlan === plan.id ? "selected" : ""} ${plan.recommended ? "recommended" : ""}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.recommended && <div className="recommended-badge">Recommandé</div>}
              <h2 className="plan-name">{plan.name}</h2>
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button
                className={`select-plan-button ${selectedPlan === plan.id ? "selected" : ""}`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {selectedPlan === plan.id ? "Sélectionné" : "Sélectionner"}
              </button>
            </div>
          ))}
        </div>

        <div className="subscription-actions">
          <button onClick={handleSubscribe} className="subscribe-button" disabled={loading || !selectedPlan}>
            {loading ? "Traitement en cours..." : "S'abonner maintenant"}
          </button>
          <button onClick={() => navigate(-1)} className="back-button">
            Retour
          </button>
        </div>

        <div className="subscription-info">
          <p>
            Tous les abonnements peuvent être annulés à tout moment. Nous proposons une garantie satisfait ou remboursé
            de 14 jours.
          </p>
          <p>Pour toute question concernant nos abonnements, contactez notre service client.</p>
        </div>
      </div>
    </div>
  )
}

export default Subscription

