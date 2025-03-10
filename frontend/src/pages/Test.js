import React, { useState } from "react";
import axios from "axios";
import "../styles.css";

function Test() {
  const [responses, setResponses] = useState({});
  const [diagnostic, setDiagnostic] = useState("");

  const questions = [
    // 🎯 Clarification de la Situation
    { question: "Qu'est-ce qui vous apporte aujourd'hui ?", name: "current_motivation" },
    { question: "Où êtes-vous actuellement ?", name: "current_location" },
    { question: "Comment décririez-vous votre situation en ce moment ?", name: "current_situation" },
    { question: "Qu'est-ce qui fonctionne bien dans votre vie actuellement ?", name: "positives" },
    { question: "Qu'est-ce qui ne fonctionne pas comme vous le souhaitez ?", name: "negatives" },
    { question: "Quelles sont les trois choses que vous aimez vraiment dans votre vie ?", name: "three_likes" },
    { question: "Que ressentez-vous quand vous pensez à cette situation ?", name: "feelings" },
    { question: "Qu'est-ce qui vous manque aujourd'hui pour vous sentir épanoui ?", name: "missing" },
    { question: "Sur quoi vous basez-vous pour dire cela ?", name: "basis" },
    { question: "Quelle est votre plus grande préoccupation actuellement ?", name: "biggest_concern" },

    // 🌟 Définition des Objectifs
    { question: "Que voulez-vous vraiment accomplir ?", name: "goal" },
    { question: "Comment sauriez-vous que vous avez atteint votre objectif ?", name: "goal_measurement" },
    { question: "Qu'est-ce qui est vraiment important pour vous dans cette situation ?", name: "important_factors" },
    { question: "Comment vous sentirez-vous une fois que vous atteindrez votre but ?", name: "goal_feelings" },
    { question: "Quel serait le meilleur résultat possible ?", name: "best_outcome" },
    { question: "À quoi ressemblerait le succès pour vous ?", name: "success_definition" },
    { question: "Si tout était possible, que voudriez-vous ?", name: "dream_scenario" },

    // 🕵️‍♂️ Prise de Conscience
    { question: "Qu'est-ce qui vous empêche d'avancer ?", name: "obstacles" },
    { question: "De quoi avez-vous peur ?", name: "fears" },
    { question: "Quelles croyances retenez-vous ?", name: "beliefs" },
    { question: "Que se passerait-il si vous ne faisiez rien ?", name: "consequences" },
    { question: "Comment cette situation affecte-t-elle d'autres domaines de votre vie ?", name: "life_impact" },

    // 🔧 Exploration des options
    { question: "Quelles solutions envisagez-vous ?", name: "possible_solutions" },
    { question: "Quelles autres possibilités existent-t-il ?", name: "other_options" },
    { question: "Si vous n'aviez pas peur, que feriez-vous ?", name: "fearless_action" },
    { question: "Que conseilleriez-vous à un ami dans votre situation ?", name: "advice_to_friend" },

    // ⚙️ Planification de l'Action
    { question: "Quel est le premier petit pas que vous pourriez faire ?", name: "first_step" },
    { question: "Quand allez-vous le faire ?", name: "timeline" },
    { question: "Comment allez-vous mesurer votre progrès ?", name: "progress_tracking" },
    { question: "Qui pourrait vous soutenir dans cette démarche ?", name: "support_system" },

    // 💡 Réflexion et Apprentissage
    { question: "Qu'avez-vous appris sur vous-même aujourd'hui ?", name: "self_learning" },
    { question: "Qu'est-ce qui vous a le plus surpris lors de cette réflexion ?", name: "biggest_surprise" },
    { question: "Que pouvez-vous célébrer aujourd'hui ?", name: "celebration" },
    { question: "Quel conseil donneriez-vous à votre futur 'vous' ?", name: "advice_to_future_self" },
  ];

  const handleChange = (questionName, value) => {
    setResponses({ ...responses, [questionName]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = `
      Un utilisateur a complété un test de coaching. Analyse ces réponses et donne un diagnostic clair :
      ${Object.entries(responses).map(([key, value]) => `- ${key} : ${value || "non renseigné"}`).join("\n")}
    `;

    try {
      const cachedDiagnostic = localStorage.getItem("diagnostic");
      if (cachedDiagnostic) {
        setDiagnostic(cachedDiagnostic);
        return;
      }

      const res = await axios.post("http://localhost:5002/api/gemini/generate-content", { text: prompt });

      setDiagnostic(res.data.response);
      localStorage.setItem("diagnostic", res.data.response);
    } catch (err) {
      console.error("Erreur API :", err);
      alert("Erreur lors de l'obtention du diagnostic.");
    }
  };

  return (
    <div className="container">
      <h2>Test Diagnostic</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q, index) => (
          <div key={index} className="question">
            <label>{q.question}</label>
            <textarea
              name={q.name}
              value={responses[q.name] || ""}
              onChange={(e) => handleChange(q.name, e.target.value)}
              required
            />
          </div>
        ))}
        <button className="btn" type="submit">Valider le test</button>
      </form>
      {diagnostic && (
        <div className="diagnostic-result">
          <h3>Votre Diagnostic</h3>
          <p>{diagnostic}</p>
        </div>
      )}
      <hr />
    </div>
  );
}

export default Test;