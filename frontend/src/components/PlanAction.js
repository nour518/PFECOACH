import React, { useState } from "react";
import "../styles.css"; // Import du fichier CSS pour le style

const PlanAction = () => {
  // Liste des objectifs avec leur état (coché ou non)
  const [objectifs, setObjectifs] = useState([
    { id: 1, texte: "Définir une vision claire de ma vie", fait: false },
    { id: 2, texte: "Établir une routine quotidienne", fait: false },
    { id: 3, texte: "Pratiquer la méditation 10 min/jour", fait: false },
  ]);

  // Fonction pour marquer un objectif comme complété
  const toggleObjectif = (id) => {
    setObjectifs(
      objectifs.map((obj) =>
        obj.id === id ? { ...obj, fait: !obj.fait } : obj
      )
    );
  };

  return (
    <div className="plan-action">
      <h2>Plan d'Action</h2>
      <table>
        <thead>
          <tr>
            <th>Objectif</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {objectifs.map((obj) => (
            <tr key={obj.id}>
              <td>{obj.texte}</td>
              <td>
                <input
                  type="checkbox"
                  checked={obj.fait}
                  onChange={() => toggleObjectif(obj.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanAction;
