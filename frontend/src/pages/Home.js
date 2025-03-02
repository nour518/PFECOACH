import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function Home() {
  const navigate = useNavigate();

  // Exemple d'avis clients
  const testimonials = [
    {
      id: 1,
      name: "Alice Dupont",
      text: "Ce coaching a transformé ma vie ! Je me sens plus confiante et épanouie.",
    },
    {
      id: 2,
      name: "Marc Durand",
      text: "Un accompagnement professionnel et humain. Je recommande vivement !",
    },
    {
      id: 3,
      name: "Sophie Martin",
      text: "Les conseils étaient pertinents et adaptés à mes besoins. Merci pour tout !",
    },
  ];

  return (
    <div className="home-container">
      <img 
        src="https://cdn.zarlasites.com/image/bf5f3790e5d887e83f7e339fe1c29b792bfbe94e64eda9ecbcba6d09ee984151/mobile-575" 
        alt="Coaching de vie" 
        className="halfscreen-image"  // Utilise la classe pour 50vh
      />
      <div className="content">
        <h1>Bienvenue sur notre plateforme de coaching de vie</h1>
        <p>Vous pouvez dès à présent passer notre test diagnostic.</p>
        <button className="btn" onClick={() => navigate("/test")}>
          Passer le test
        </button>
      </div>

      {/* Section Avis Clients */}
      <div className="testimonials">
        <h2>Avis de nos clients</h2>
        <div className="testimonial-cards">
          {testimonials.map((item) => (
            <div key={item.id} className="testimonial-card">
              <p className="testimonial-text">"{item.text}"</p>
              <p className="testimonial-name">- {item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
