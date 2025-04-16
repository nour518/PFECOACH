import React, { useState } from 'react';


const PlanAction = () => {
  const actions = [
    { id: 1, objectif: "Clarifier sa vision et ses valeurs personnelles" },
    { id: 2, objectif: "Fixer des objectifs de vie alignés avec ses aspirations" },
    { id: 3, objectif: "Gérer efficacement son stress et ses émotions" },
    { id: 4, objectif: "Améliorer la confiance et l'estime de soi" },
    { id: 5, objectif: "Développer une routine quotidienne équilibrée" },
    { id: 6, objectif: "Renforcer la motivation et la discipline personnelle" },
    { id: 7, objectif: "Créer un plan d'action pour atteindre ses objectifs" },
    { id: 8, objectif: "Améliorer ses relations interpersonnelles" },
    { id: 9, objectif: "Adopter une attitude positive et proactive" },
    { id: 10, objectif: "Faire le bilan de ses progrès et ajuster sa stratégie" }
  ];

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const [checked, setChecked] = useState({});
  const [evaluations, setEvaluations] = useState({});

  const toggleCheck = (actionId, day) => {
    setChecked(prev => ({
      ...prev,
      [`${actionId}-${day}`]: !prev[`${actionId}-${day}`]
    }));
  };

  const handleEvaluationChange = (actionId, day, value) => {
    setEvaluations(prev => ({
      ...prev,
      [`${actionId}-${day}`]: value
    }));
  };

  return (
    <div className="plan-container">
      <h2>Plan d'Action</h2>
      <div className="table-responsive">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Objectif</th>
              {days.map(day => (
                <th key={day}>{day}</th>
              ))}
              <th>Évaluation</th>
            </tr>
          </thead>
          <tbody>
            {actions.map(action => (
              <tr key={action.id}>
                <td>{action.objectif}</td>
                {days.map(day => (
                  <td key={day} className="checkbox-cell">
                    <input 
                      type="checkbox" 
                      checked={checked[`${action.id}-${day}`] || false} 
                      onChange={() => toggleCheck(action.id, day)} 
                    />
                  </td>
                ))}
                <td className="evaluation-cell">
                  {/* Nouveau champ d'évaluation pour chaque action */}
                  <input
                    type="text"
                    placeholder="Évaluer"
                    value={evaluations[`${action.id}`] || ''}
                    onChange={(e) => handleEvaluationChange(action.id, 'evaluation', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanAction;