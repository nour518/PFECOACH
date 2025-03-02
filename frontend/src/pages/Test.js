import React, { useState } from "react";

import axios from "axios";
import "../styles.css";

function Test() {
  const [responses, setResponses] = useState({});
  const [diagnostic, setDiagnostic] = useState("");


  const questions = [
    { question: "Comment décririez-vous votre niveau de satisfaction actuel dans la vie ?", options: ["Très satisfait(e)", "Plutôt satisfait(e)", "Neutre", "Plutôt insatisfait(e)", "Très insatisfait(e)"], name: "satisfaction" },
    { question: "Quel domaine de votre vie souhaiteriez-vous améliorer en priorité ?", options: ["Carrière", "Relations", "Santé", "Développement personnel", "Équilibre pro/perso"], name: "priority" },
    { question: "Quel est votre plus grand défi actuel ?", options: ["Gérer mon temps", "Surmonter mes peurs", "Atteindre mes objectifs", "Améliorer mes relations", "Trouver un sens"], name: "challenge" },
    { question: "Comment gérez-vous les obstacles ?", options: ["Je les évite", "Je me décourage", "J'apprends de mes erreurs", "Je demande de l’aide", "Je les vois comme une opportunité"], name: "obstacles" },
    { question: "Quel est votre niveau d’énergie au quotidien ?", options: ["Élevé", "Moyen", "Faible", "Variable", "Je me sens perdu(e)"], name: "energy" },
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

      const res = await axios.post("http://localhost:5002/api/openai/chat", { message: prompt });
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
            <div className="options">
              {q.options.map((option, idx) => (
                <label key={idx}>
                  <input
                    type="radio"
                    name={q.name}
                    value={option}
                    checked={responses[q.name] === option}
                    onChange={() => handleChange(q.name, option)}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
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
