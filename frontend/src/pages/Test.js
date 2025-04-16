import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./test.css";

const Test = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {

const response = await fetch("http://localhost:5002/api/questions"); 
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des questions");
        }
        const data = await response.json();
        setQuestions(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleResponseChange = (e) => {
    setResponses({
      ...responses,
      [questions[currentQuestionIndex].name]: e.target.value,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("📩 Envoi des réponses au backend :", responses);

      const response = await fetch("http://localhost:5002/api/gemini/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur serveur : ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      console.log("✅ Réponse reçue du backend :", data);

      localStorage.setItem("diagnostic", JSON.stringify(data));
      navigate("/result");
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du test :", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="test-page">Chargement des questions...</div>;
  }

  if (error) {
    return <div className="test-page">Erreur: {error}</div>;
  }

  if (questions.length === 0) {
    return <div className="test-page">Aucune question disponible</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="test-page">
      <h1>Test de diagnostic</h1>
      {error && (
        <div className="error-message">
          <p><strong>Erreur :</strong> {error}</p>
        </div>
      )}
      <div className="question-card">
        <h2>{currentQuestion.question}</h2>
        <textarea
          value={responses[currentQuestion.name] || ""}
          onChange={handleResponseChange}
          placeholder="Votre réponse..."
          className="response-textarea"
        ></textarea>
      </div>
      <div className="navigation-buttons">
        <button 
          onClick={handlePreviousQuestion} 
          disabled={currentQuestionIndex === 0}
          className="nav-button"
        >
          Précédent
        </button>
        {currentQuestionIndex < questions.length - 1 && (
          <button onClick={handleNextQuestion} className="nav-button">
            Suivant
          </button>
        )}
        {currentQuestionIndex === questions.length - 1 && (
          <button 
            onClick={handleSubmitTest} 
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? "Soumission en cours..." : "Soumettre le test"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Test;