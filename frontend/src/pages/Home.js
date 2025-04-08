"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "../home.css"

const Home = () => {
  const navigate = useNavigate()
  const [position, setPosition] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const trainRef = useRef(null)
  const autoPlayRef = useRef(null)
  const pauseTimeoutRef = useRef(null)

  // Intervalle de déplacement en millisecondes (5 secondes)
  const autoPlayInterval = 5000

  const testimonials = [
    {
      id: 1,
      name: "Alice Dupont",
      text: "Ce coaching a transformé ma vie ! Je me sens plus confiante et épanouie. Grâce aux conseils personnalisés, j'ai atteint mes objectifs professionnels et personnels en seulement 6 mois.",
    },
    {
      id: 2,
      name: "Marc Durand",
      text: "Un accompagnement professionnel et humain. Le coach a su m'écouter et me guider dans ma reconversion professionnelle. Je recommande vivement !",
    },
    {
      id: 3,
      name: "Sophie Martin",
      text: "Les conseils étaient pertinents et adaptés à mes besoins. Grâce au plan d'action personnalisé, j'ai enfin réussi à atteindre un équilibre entre ma vie personnelle et professionnelle.",
    },
    {
      id: 4,
      name: "Thomas Leroy",
      text: "J'étais sceptique au début, mais après quelques séances, j'ai vu des changements concrets dans ma façon d'aborder les défis. Une expérience vraiment transformatrice.",
    },
    {
      id: 5,
      name: "Julie Moreau",
      text: "Le coaching m'a aidé à identifier mes forces et à les utiliser pour surmonter mes obstacles. Je me sens maintenant capable d'atteindre tous mes objectifs.",
    },
  ]

  const coaches = [
    {
      id: 1,
      name: "Jean Dupont",
      specialty: "Coach de Vie",
      bio: "Jean est un coach certifié avec plus de 10 ans d'expérience. Il aide ses clients à atteindre un équilibre personnel et professionnel.",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "Marie Lemoine",
      specialty: "Coach en Développement Personnel",
      bio: "Marie est spécialisée dans le développement personnel et l'épanouissement. Elle aide ses clients à prendre confiance en eux.",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      id: 3,
      name: "Luc Martin",
      specialty: "Coach en Carrière",
      bio: "Luc aide ses clients à réussir dans leur carrière en se fixant des objectifs professionnels clairs et atteignables.",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ]

  // Calculer le nombre total de positions possibles
  const calculateMaxPosition = () => {
    if (!trainRef.current) return 0

    const trainWidth = trainRef.current.scrollWidth
    const containerWidth = trainRef.current.parentElement.clientWidth
    const maxScroll = trainWidth - containerWidth

    // Diviser en étapes pour un défilement plus fluide
    return Math.max(0, Math.floor(maxScroll / 380))
  }

  // Fonction pour déplacer le train vers la droite
  const moveNext = () => {
    const maxPosition = calculateMaxPosition()
    if (position < maxPosition) {
      setPosition(position + 1)
    } else {
      // Retour au début avec une animation spéciale
      resetToStart()
    }
    pauseAutoPlay()
  }

  // Fonction pour déplacer le train vers la gauche
  const movePrev = () => {
    if (position > 0) {
      setPosition(position - 1)
    } else {
      // Aller à la fin avec une animation spéciale
      jumpToEnd()
    }
    pauseAutoPlay()
  }

  // Fonction pour revenir au début avec une animation
  const resetToStart = () => {
    // Animation spéciale pour revenir au début
    if (trainRef.current) {
      trainRef.current.style.transition = "none"
      setPosition(0)
      setTimeout(() => {
        if (trainRef.current) {
          trainRef.current.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)"
        }
      }, 50)
    }
  }

  // Fonction pour aller à la fin avec une animation
  const jumpToEnd = () => {
    const maxPosition = calculateMaxPosition()
    if (trainRef.current) {
      trainRef.current.style.transition = "none"
      setPosition(maxPosition)
      setTimeout(() => {
        if (trainRef.current) {
          trainRef.current.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)"
        }
      }, 50)
    }
  }

  // Fonction pour mettre en pause temporairement le défilement automatique
  const pauseAutoPlay = () => {
    setIsPaused(true)

    // Nettoyer tout timeout existant
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
    }

    // Reprendre après 10 secondes d'inactivité
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 10000)
  }

  // Mettre à jour la position du train lorsque position change
  useEffect(() => {
    if (trainRef.current) {
      const translateX = position * -380 // 380px est la largeur d'une carte + gap
      trainRef.current.style.transform = `translateX(${translateX}px)`

      // Mettre à jour la barre de progression
      const progressBar = document.querySelector(".train-progress-bar")
      if (progressBar) {
        const maxPosition = calculateMaxPosition()
        const progressPercent = maxPosition > 0 ? (position / maxPosition) * 100 : 0
        progressBar.style.width = `${progressPercent}%`
      }
    }
  }, [position])

  // Mettre en place le défilement automatique
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (!isPaused) {
          moveNext()
        }
      }, autoPlayInterval)
    }

    startAutoPlay()

    // Nettoyage lors du démontage du composant
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }
    }
  }, [isPaused, position])

  // Gestionnaires d'événements pour pause au survol
  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    // Reprendre après 2 secondes
    setTimeout(() => {
      setIsPaused(false)
    }, 2000)
  }

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="header">
        <h1>Transformez votre vie avec notre coaching personnalisé</h1>
        <p>
          Atteignez vos objectifs, surmontez vos défis et vivez une vie épanouie grâce à un accompagnement sur mesure,
          conçu pour vous.
        </p>
        <button className="cta-button" onClick={() => navigate("/test")}>
          Passer un Test
        </button>
      </header>

      <section className="photo-section">
  <div className="carousel-background">
    <h2>Nos Services</h2>
    <div className="carousel-container">
      <div className="carousel-item">
        <i className="fas fa-users"></i>
        <h3>Coaching en Groupe</h3>
        <p>Participez à des sessions de coaching en groupe pour échanger et apprendre avec d'autres.</p>
      </div>
      <div className="carousel-item">
        <i className="fas fa-briefcase"></i>
        <h3>Coaching Professionnel</h3>
        <p>Ayez un accompagnement personnalisé pour vos objectifs professionnels.</p>
      </div>
      <div className="carousel-item">
        <i className="fas fa-heart"></i>
        <h3>Coaching Personnel</h3>
        <p>Obtenez un soutien pour votre développement personnel et atteindre un équilibre de vie.</p>
      </div>
    </div>
  </div>
</section>



      <section className="about">
        <h2>Qu'est-ce que notre plateforme de coaching ?</h2>
        <div className="about-content">
          <img
            src="https://www.agencenice.fr/wp-content/uploads/2024/08/coach-de-vie.jpg"
            alt="Plateforme de Coaching"
            className="about-image"
          />
          <p>
            Notre plateforme offre des services de coaching personnalisé pour vous aider à atteindre vos objectifs de
            vie, qu'ils soient personnels ou professionnels. Grâce à une équipe de coachs certifiés, nous vous
            fournissons un accompagnement sur mesure pour chaque étape de votre parcours.
          </p>
        </div>
      </section>

      {/* Testimonial Section avec effet Train */}
      <section id="testimonials" className="testimonials">
        <h2>Avis de nos clients</h2>
        <div className="testimonial-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="testimonial-train" ref={trainRef}>
            {testimonials.map((item) => (
              <div key={item.id} className="testimonial-card">
                <p className="testimonial-text">"{item.text}"</p>
                <p className="testimonial-name">- {item.name}</p>
              </div>
            ))}
          </div>
          <div className="train-controls">
            <button className="train-arrow" onClick={movePrev}>
              ←
            </button>
            <div className="train-progress">
              <div className="train-progress-bar"></div>
            </div>
            <button className="train-arrow" onClick={moveNext}>
              →
            </button>
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section id="coaches" className="coaches">
        <h2>Nos Coachs</h2>
        <div className="coach-cards">
          {coaches.map((coach) => (
            <div key={coach.id} className="coach-card">
              <img src={coach.image || "/placeholder.svg"} alt={coach.name} className="coach-image" />
              <h3>{coach.name}</h3>
              <p>
                <strong>{coach.specialty}</strong>
              </p>
              <p>{coach.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <h2>Découvrez comment notre approche peut changer votre vie</h2>
        <p>Regardez cette vidéo pour en savoir plus sur notre méthode et les résultats que vous pouvez attendre.</p>
        <div className="video-container">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/wB1D2SRoykk"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Clients Coachés Section */}
      <section className="clients-coached">
        <h2>Nos Résultats</h2>
        <div className="statistics">
          <div className="stat">
            <h3>95%</h3>
            <p>Clients satisfaits</p>
          </div>
          <div className="stat">
            <h3>80%</h3>
            <p>Clients ayant atteint leurs objectifs</p>
          </div>
          <div className="stat">
            <h3>60%</h3>
            <p>Clients ayant obtenu une promotion professionnelle</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

