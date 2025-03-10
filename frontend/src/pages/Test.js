import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles.css";

function Test() {
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook pour la navigation

  const questions = [
    {
      category: "🎯 Clarification de la Situation",
      questions: [
        { question: "Qu'est-ce qui vous apporte aujourd'hui ?", name: "current_concern" },
        { question: "Où êtes-vous actuellement ?", name: "current_location" },
        { question: "Comment décririez-vous votre situation en ce moment ?", name: "current_situation" },
        { question: "Qu'est-ce qui fonctionne bien dans votre vie actuellement ?", name: "positive_aspects" },
        { question: "Qu'est-ce qui ne fonctionne pas comme vous le souhaitez ?", name: "negative_aspects" },
        { question: "Quelles sont les trois choses que vous aimez vraiment dans votre vie ?", name: "three_likes" },
        { question: "Que ressentez-vous quand vous pensez à cette situation ?", name: "feelings_about_situation" },
        { question: "Qu'est-ce qui vous manque aujourd'hui pour vous sentir épanoui ?", name: "missing_elements" },
        { question: "Sur quoi vous basez-vous pour dire cela ?", name: "basis_for_assessment" },
        { question: "Quelle est votre plus grande préoccupation actuellement ?", name: "biggest_concern" }
      ]
    },
    {
      category: "🌟 Définition des Objectifs",
      questions: [
        { question: "Que voulez-vous vraiment accomplir ?", name: "goal_accomplish" },
        { question: "Comment sauriez-vous que vous avez atteint votre objectif ?", name: "goal_measurement" },
        { question: "Qu'est-ce qui est vraiment important pour vous dans cette situation ?", name: "important_elements" },
        { question: "Comment vous permettra-vous une fois que vous atteindrez votre but ?", name: "how_will_you_feel" },
        { question: "Quel serait le meilleur résultat possible ?", name: "best_possible_outcome" },
        { question: "À quoi ressemblerait le succès pour vous ?", name: "success_appearance" },
        { question: "Si tout était possible, que voudriez-vous ?", name: "ideal_scenario" },
        { question: "Quels voulez-vous voir dans votre vie changements ?", name: "life_changes" },
        { question: "Qu'est-ce que vous voulez préserver tout en avançant ?", name: "elements_to_preserve" },
        { question: "Si vous pouviez changer une seule chose, quelle serait-elle ?", name: "change_one_thing" }
      ]
    },
    {
      category: "🕵️‍♂️ Prise de Conscience",
      questions: [
        { question: "Qu'est-ce qui vous empêche d'avancer ?", name: "what_stops_you" },
        { question: "De quoi avez-vous peur ?", name: "fear_elements" },
        { question: "Quelles croyances retenez-vous ?", name: "limiting_beliefs" },
        { question: "Que se passerait-il si vous ne faisiez rien ?", name: "what_if_nothing" },
        { question: "Comment cette situation affecte-t-elle d'autres domaines de votre vie ?", name: "life_impact" },
        { question: "Que pouvez-vous apprendre de cette situation ?", name: "lesson_from_situation" },
        { question: "Que voyez-vous que vous n'aviez pas remarqué auparavant ?", name: "new_insights" },
        { question: "Qu'est-ce qui pourrait vous surprendre dans cette situation ?", name: "surprise_elements" },
        { question: "À quel moment vous êtes-vous déjà senti comme ça ?", name: "past_similar_feeling" },
        { question: "Quelles émotions sont liées à cette situation ?", name: "emotion_linked" }
      ]
    },
    {
      category: "🔧 Exploration des options",
      questions: [
        { question: "Quelles solutions envisagez-vous ?", name: "considered_solutions" },
        { question: "Quelles autres possibilités existent-t-il ?", name: "other_possibilities" },
        { question: "Si vous n'aviez pas peur, que feriez-vous ?", name: "no_fear_action" },
        { question: "Que conseilleriez-vous à un ami dans votre situation ?", name: "advice_for_friend" },
        { question: "Qu'est-ce que vous pourriez faire différemment ?", name: "what_to_do_differently" },
        { question: "Quels sont les avantages et les inconvénients de chaque option ?", name: "pros_cons" },
        { question: "Qu'est-ce qui vous inspire ?", name: "what_inspires_you" },
        { question: "Si vous étiez certain de réussir, que tendiez-vous ?", name: "what_would_you_do" },
        { question: "Qu'est-ce que vous êtes prêt à essayer maintenant ?", name: "ready_to_try" },
        { question: "Que se passerait-il si vous osiez ?", name: "what_if_you_dared" }
      ]
    },
    {
      category: "⚙️ Planification de l'Action",
      questions: [
        { question: "Quel est le premier petit pas que vous pourriez faire ?", name: "first_step" },
        { question: "Quand allez-vous le faire ?", name: "when_first_step" },
        { question: "Qu'est-ce qui pourrait vous empêcher de réaliser ce plan ?", name: "what_could_stop_plan" },
        { question: "Comment allez-vous mesurer votre progrès ?", name: "how_to_measure_progress" },
        { question: "De quelle ressource avez-vous besoin pour avancer ?", name: "resources_needed" },
        { question: "Qui pourrait vous soutenir dans cette démarche ?", name: "who_can_support" },
        { question: "Qu'est-ce que vous allez faire aujourd'hui pour vous rapprocher de votre objectif ?", name: "today_action" },
        { question: "Que ferez-vous si les choses ne se passent pas comme prévu ?", name: "what_if_not_go_as_planned" },
        { question: "Comment vous engagez-vous à suivre ce plan ?", name: "commitment_to_plan" },
        { question: "Quelles habitudes pourriez-vous mettre en place pour soutenir votre objectif ?", name: "supporting_habits" }
      ]
    },
    {
      category: "💡 Réflexion et Apprentissage",
      questions: [
        { question: "Qu'avez-vous appris sur vous-même aujourd'hui ?", name: "what_did_you_learn" },
        { question: "Qu'est-ce qui vous a le plus surpris lors de cette réflexion ?", name: "what_surprised_you" },
        { question: "Qu'est-ce qui a été le plus utile pour vous dans cette séance ?", name: "most_useful_part" },
        { question: "Si vous deviez reprendre votre expérience en un mot, lequel serait-il ?", name: "one_word_experience" },
        { question: "Que pouvez-vous célébrer aujourd'hui ?", name: "what_to_celebrate" },
        { question: "Comment allez-vous maintenir cette dynamique ?", name: "how_to_maintain_momentum" },
        { question: "Qu'est-ce qui vous rend fier de vous-même ?", name: "what_makes_you_proud" },
        { question: "Quel conseil donneriez-vous à votre futur « vous » ?", name: "advice_to_future_self" },
        { question: "Comment allez-vous appliquer ce que vous avez appris aujourd'hui ?", name: "how_to_apply_learning" },
        { question: "De quoi êtes-vous reconnaissant en ce moment ?", name: "what_are_you_grateful_for" }
      ]
    }
  ];

  const handleChange = (questionName, value) => {
    setResponses({ ...responses, [questionName]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const prompt = `
      Vous êtes un coach professionnel spécialisé dans le bien-être. Voici les réponses d'un utilisateur à un questionnaire sur son mode de vie et sa santé mentale. 
      Analysez ces réponses et fournissez un diagnostic détaillé ainsi que des recommandations personnalisées. Utilisez un ton bienveillant et encourageant.
      
      Réponses :
      ${Object.entries(responses).map(([key, value]) => `- ${key} : ${value || "non renseigné"}`).join("\n")}

      Diagnostic et recommandations :
    `;

    try {
      const res = await axios.post("http://localhost:5002/api/gemini/diagnostic", {
        userId: "67b31f9ced85b56300b8ed98",
        responses: responses,
        prompt: prompt
      });

      // Stocker le diagnostic dans localStorage
      localStorage.setItem("diagnostic", res.data.diagnostic);
      
      // Rediriger vers la page des résultats
      navigate("/result");
      
    } catch (err) {
      console.error("Erreur API :", err.response ? err.response.data : err.message);
      alert("Erreur lors de l'obtention du diagnostic. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Test Diagnostic</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((categoryObj, index) => (
          <div key={index} className="category">
            <h3>{categoryObj.category}</h3>
            {categoryObj.questions.map((q, idx) => (
              <div key={idx} className="question">
                <label>{q.question}</label>
                <input
                  type="text"
                  name={q.name}
                  value={responses[q.name] || ""}
                  onChange={(e) => handleChange(q.name, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        ))}
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Analyse en cours..." : "Valider le test"}
        </button>
      </form>
    </div>
  );
}

export default Test;
