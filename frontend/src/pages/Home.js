import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Home = () => {
    const navigate = useNavigate();

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
    ];

    return (
        <div className="home-container">
            <header className="header">
                <h1>Transformez votre vie avec notre coaching personnalisé</h1>
                <p>Atteignez vos objectifs, surmontez vos défis et vivez une vie épanouie grâce à un accompagnement sur mesure, conçu pour vous.</p>
                <button className="cta-button" onClick={() => navigate("/test")}>
                    Passer un Test 
                </button>
            </header>

            <img 
                src="https://cdn.zarlasites.com/image/bf5f3790e5d887e83f7e339fe1c29b792bfbe94e64eda9ecbcba6d09ee984151/mobile-575" 
                alt="Coaching de vie - Accompagnement personnalisé" 
                className="halfscreen-image"
            />

            <div className="container">
                <h2>Pourquoi Choisir Notre Coaching ?</h2>
                <div className="features">
                    <div className="feature">
                        <h3>🔍 Évaluation Personnalisée</h3>
                        <p>Identifiez vos besoins réels pour mieux cibler vos priorités et améliorer votre bien-être.</p>
                    </div>
                    <div className="feature">
                        <h3>📈 Plan d'Action Sur Mesure</h3>
                        <p>Recevez un programme d'action détaillé, spécifique à vos objectifs et à votre situation.</p>
                    </div>
                    <div className="feature">
                        <h3>💡 Accompagnement d'un Coach</h3>
                        <p>Bénéficiez de conseils d'experts qui vous soutiendront à chaque étape pour réaliser vos rêves.</p>
                    </div>
                </div>
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

            {/* Section Vidéo */}
            <div className="video-section">
                <h2>Découvrez comment notre approche peut changer votre vie</h2>
                <p>Regardez cette vidéo pour en savoir plus sur notre méthode et les résultats que vous pouvez attendre.</p>
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

            {/* Section FAQ */}
            <div className="faq">
                <h2>Questions fréquentes</h2>
                <ul>
                    <li><strong>Comment se passe le test d'évaluation ?</strong> Vous remplissez un questionnaire rapide pour déterminer vos besoins et objectifs.</li>
                    <li><strong>Combien de temps dure un coaching ?</strong> Chaque coaching est adapté à vos besoins, mais en général, une session dure entre 60 et 90 minutes.</li>
                    <li><strong>Est-ce que les coachs sont certifiés ?</strong> Oui, tous nos coachs sont certifiés et ont plusieurs années d'expérience.</li>
                </ul>
            </div>

        </div>
    );
};

export default Home;
