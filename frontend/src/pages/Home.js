"use client"

import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import "../home.css"

const Home = () => {
  const navigate = useNavigate()
  const trainRef = useRef(null)

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

  // Dupliquer les témoignages pour créer un effet de défilement infini
  const duplicatedTestimonials = [...testimonials, ...testimonials]

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

      {/* Image à demi-écran avec flou */}
      <section className="photo-section">
        <div className="image-background">
          <img
            src="https://www.pnl.ch/wp-content/uploads/2018/10/comprendre-metier-coach.jpg"
            alt="Coaching de vie - Accompagnement personnalisé"
            className="halfscreen-image"
          />
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

      {/* Testimonial Section avec défilement automatique */}
      <section id="testimonials" className="testimonials">
        <h2>Avis de nos clients</h2>
        <div className="testimonial-container">
          <div className="testimonial-train" ref={trainRef}>
            {duplicatedTestimonials.map((item, index) => (
              <div key={`${item.id}-${index}`} className="testimonial-card">
                <p className="testimonial-text">"{item.text}"</p>
                <p className="testimonial-name">- {item.name}</p>
              </div>
            ))}
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

