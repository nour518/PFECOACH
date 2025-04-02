import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Test = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Questions du test
  const questions = [
    { id: 1, question: "Qu'est-ce qui vous apporte aujourd'hui ?", type: "text", name: "current_concern" },
    { id: 2, question: "Où êtes-vous actuellement ?", type: "text", name: "current_location" },
    { id: 3, question: "Comment décririez-vous votre situation en ce moment ?", type: "text", name: "current_situation" },
    { id: 4, question: "Qu'est-ce qui fonctionne bien dans votre vie actuellement ?", type: "text", name: "positive_aspects" },
    { id: 5, question: "Qu'est-ce qui ne fonctionne pas comme vous le souhaitez ?", type: "text", name: "negative_aspects" },
    { id: 6, question: "Quelles sont les trois choses que vous aimez vraiment dans votre vie ?", type: "text", name: "three_likes" },
    { id: 7, question: "Que ressentez-vous quand vous pensez à cette situation ?", type: "text", name: "feelings_about_situation" },
    { id: 8, question: "Qu'est-ce qui vous manque aujourd'hui pour vous sentir épanoui ?", type: "text", name: "missing_elements" },
    { id: 9, question: "Sur quoi vous basez-vous pour dire cela ?", type: "text", name: "basis_for_assessment" },
    { id: 10, question: "Quelle est votre plus grande préoccupation actuellement ?", type: "text", name: "biggest_concern" },
  ];

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
        const errorMessage = await response.text(); // Affiche l'erreur serveur
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
  

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="test-page">
      <h1>Test de diagnostic</h1>
      {error && <div className="error-message"><p><strong>Erreur:</strong> {error}</p></div>}
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
        <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>Précédent</button>
        <button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}>Suivant</button>
        {currentQuestionIndex === questions.length - 1 && (
          <button onClick={handleSubmitTest} disabled={isSubmitting}>Soumettre le test</button>
        )}
      </div>
    </div>
  );
};

export default Test;
