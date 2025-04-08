import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../coachdashbord.css";

const CoachDashboard = () => {
  const [users, setUsers] = useState([]);
  const [diagnostics, setDiagnostics] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDiagnostics, setUserDiagnostics] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionPlans, setActionPlans] = useState([]);
  const [newDiagnostic, setNewDiagnostic] = useState("");
  const [newActionPlan, setNewActionPlan] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "pending"
  });
  const [showDiagnosticForm, setShowDiagnosticForm] = useState(false);
  const [showActionPlanForm, setShowActionPlanForm] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || !user || user.role !== "coach") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [token, navigate, user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Pour l'exemple, si le coach est "Sadek", on utilise des données mock
      if (user && user.email === "sadek21@gmail.com") {
        const mockUsers = [
          { 
            _id: "user1", 
            name: "Ahmed Ben Ali", 
            email: "ahmed@example.com",
            subscriptionDate: "2023-10-15",
            subscriptionStatus: "active",
            testResponses: [
              {
                testId: "test1",
                date: "2023-11-10",
                responses: {
                  q1: "Je me sens souvent stressé",
                  q2: "J'ai du mal à prendre des décisions",
                  q3: "Je me sens motivé environ 3 jours par semaine"
                },
                aiAnalysis: {
                  stressLevel: "élevé",
                  confidenceLevel: "faible",
                  motivationLevel: "moyenne",
                  aiDiagnostic: "Le client montre des signes de stress élevé et de confiance en soi faible. Recommandation: techniques de relaxation et exercices de confiance."
                },
                coachValidation: null
              }
            ]
          },
          { 
            _id: "user2", 
            name: "Fatima Zahra", 
            email: "fatima@example.com",
            subscriptionDate: "2023-09-20",
            subscriptionStatus: "active",
            testResponses: []
          },
          { 
            _id: "user3", 
            name: "Mohamed Salah", 
            email: "mohamed@example.com",
            subscriptionDate: "2024-01-05",
            subscriptionStatus: "active",
            testResponses: []
          },
        ];

        const mockDiagnostics = [
          {
            _id: "diag1",
            userId: "user1",
            userName: "Ahmed Ben Ali",
            diagnostic: "Vous avez besoin de travailler sur votre confiance en vous...",
            date: new Date("2023-11-15"),
            responses: { stress: "élevé", confiance: "faible", motivation: "moyenne" },
            aiAnalysis: {
              stressLevel: "élevé",
              confidenceLevel: "faible",
              motivationLevel: "moyenne",
              aiDiagnostic: "Le client montre des signes de stress élevé et de confiance en soi faible. Recommandation: techniques de relaxation et exercices de confiance."
            },
            coachNotes: "Je confirme l'analyse de l'IA. Ajouter des exercices de visualisation."
          },
          {
            _id: "diag2",
            userId: "user2",
            userName: "Fatima Zahra",
            diagnostic: "Votre équilibre vie pro/vie perso est à améliorer...",
            date: new Date("2023-12-01"),
            responses: { stress: "moyen", confiance: "moyenne", motivation: "faible" },
            aiAnalysis: {
              stressLevel: "moyen",
              confidenceLevel: "moyenne",
              motivationLevel: "faible",
              aiDiagnostic: "Difficulté à maintenir la motivation. Besoin de clarifier les objectifs."
            },
            coachNotes: "Proposer une séance sur la fixation d'objectifs SMART"
          },
        ];

        const mockActionPlans = [
          {
            _id: "plan1",
            userId: "user1",
            userName: "Ahmed Ben Ali",
            title: "Amélioration de la confiance en soi",
            description: "Exercices quotidiens de visualisation et affirmation positive",
            createdDate: new Date("2023-11-16"),
            deadline: "2023-12-16",
            status: "in-progress",
            progressUpdates: [
              {
                date: "2023-11-20",
                note: "Ahmed a bien suivi les exercices cette semaine"
              }
            ]
          },
          {
            _id: "plan2",
            userId: "user2",
            userName: "Fatima Zahra",
            title: "Équilibre vie pro/vie perso",
            description: "Fixer des limites claires et planifier des temps de repos",
            createdDate: new Date("2023-12-02"),
            deadline: "2024-01-02",
            status: "not-started",
            progressUpdates: []
          }
        ];

        setUsers(mockUsers);
        setDiagnostics(mockDiagnostics);
        setActionPlans(mockActionPlans);
        setIsLoading(false);
        return;
      }

      // Si le coach n'est pas "Sadek", récupérer les données depuis le serveur
      const usersResponse = await fetch("http://localhost:5002/api/coach/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!usersResponse.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
      const usersData = await usersResponse.json();
      setUsers(usersData);

      const diagnosticsResponse = await fetch("http://localhost:5002/api/coach/diagnostics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!diagnosticsResponse.ok) throw new Error("Erreur lors de la récupération des diagnostics");
      const diagnosticsData = await diagnosticsResponse.json();
      setDiagnostics(diagnosticsData);

      const actionPlansResponse = await fetch("http://localhost:5002/api/coach/action-plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (actionPlansResponse.ok) {
        const actionPlansData = await actionPlansResponse.json();
        setActionPlans(actionPlansData);
      }
    } catch (err) {
      setError(err.message);
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = async (userId) => {
    setSelectedUser(userId);
    setIsLoading(true);
    try {
      if (user && user.email === "sadek21@gmail.com") {
        const mockUserDiagnostics = diagnostics.filter((diag) => diag.userId === userId);
        setUserDiagnostics(mockUserDiagnostics);

        const mockUserActionPlans = actionPlans.filter((plan) => plan.userId === userId);
        setActionPlans(mockUserActionPlans);
        setIsLoading(false);
        return;
      }
      const [diagnosticsResponse, actionPlansResponse] = await Promise.all([
        fetch(`http://localhost:5002/api/coach/diagnostics/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5002/api/coach/action-plans/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (!diagnosticsResponse.ok) throw new Error("Erreur lors de la récupération des diagnostics de l'utilisateur");
      const diagnosticsData = await diagnosticsResponse.json();
      setUserDiagnostics(diagnosticsData);
      if (actionPlansResponse.ok) {
        const actionPlansData = await actionPlansResponse.json();
        setActionPlans(actionPlansData);
      }
    } catch (err) {
      setError(err.message);
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateAIResponse = (userId, testId, isValid, coachNotes) => {
    console.log(`Validation pour user ${userId}, test ${testId}:`, isValid, coachNotes);
    const updatedUsers = users.map(u => {
      if (u._id === userId) {
        const updatedResponses = u.testResponses.map(res => {
          if (res.testId === testId) {
            return {
              ...res,
              coachValidation: {
                isValid,
                coachNotes,
                validationDate: new Date().toISOString()
              }
            };
          }
          return res;
        });
        return { ...u, testResponses: updatedResponses };
      }
      return u;
    });
    setUsers(updatedUsers);
  };

  const submitDiagnostic = (userId) => {
    console.log(`Nouveau diagnostic pour user ${userId}:`, newDiagnostic);
    const newDiag = {
      _id: `diag-new-${Date.now()}`,
      userId,
      userName: users.find(u => u._id === userId)?.name || "Utilisateur",
      diagnostic: newDiagnostic,
      date: new Date(),
      coachNotes: "",
      aiAnalysis: {}
    };
    setUserDiagnostics([...userDiagnostics, newDiag]);
    setDiagnostics([...diagnostics, newDiag]);
    setNewDiagnostic("");
    setShowDiagnosticForm(false);
  };

  const submitActionPlan = (userId) => {
    console.log(`Nouveau plan d'action pour user ${userId}:`, newActionPlan);
    const newPlan = {
      _id: `plan-new-${Date.now()}`,
      userId,
      userName: users.find(u => u._id === userId)?.name || "Utilisateur",
      ...newActionPlan,
      createdDate: new Date(),
      progressUpdates: []
    };
    setActionPlans([...actionPlans, newPlan]);
    setNewActionPlan({
      title: "",
      description: "",
      deadline: "",
      status: "pending"
    });
    setShowActionPlanForm(false);
  };

  const addProgressUpdate = (planId, update) => {
    console.log(`Mise à jour pour plan ${planId}:`, update);
    const updatedPlans = actionPlans.map(plan => {
      if (plan._id === planId) {
        return {
          ...plan,
          progressUpdates: [
            ...plan.progressUpdates,
            { date: new Date().toISOString(), note: update }
          ]
        };
      }
      return plan;
    });
    setActionPlans(updatedPlans);
  };

  if (isLoading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="coach-dashboard">
      <h1>Tableau de Bord Coach</h1>
      <div className="dashboard-tabs">
        <button className={`tab-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          Utilisateurs
        </button>
        <button className={`tab-button ${activeTab === "diagnostics" ? "active" : ""}`} onClick={() => setActiveTab("diagnostics")}>
          Tous les Diagnostics
        </button>
        <button className={`tab-button ${activeTab === "action-plans" ? "active" : ""}`} onClick={() => setActiveTab("action-plans")}>
          Plans d'Action
        </button>
      </div>

      {activeTab === "users" && (
        <div className="users-section">
          <h2>Liste des Abonnés</h2>
          <div className="users-container">
            <div className="users-list">
              <h3>Abonnés ({users.length})</h3>
              <ul>
                {users.map((usr) => (
                  <li
                    key={usr._id}
                    className={selectedUser === usr._id ? "selected" : ""}
                    onClick={() => handleUserSelect(usr._id)}
                  >
                    <strong>{usr.name}</strong> - {usr.email}
                    <div className="user-meta">
                      <span>Abonnement: {usr.subscriptionStatus || 'active'}</span>
                      <span>Depuis: {new Date(usr.subscriptionDate || '2023-01-01').toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {selectedUser && (
              <div className="user-details">
                <div className="user-tabs">
                  <button onClick={() => setShowDiagnosticForm(!showDiagnosticForm)}>
                    {showDiagnosticForm ? "Annuler" : "Créer Diagnostic"}
                  </button>
                  <button onClick={() => setShowActionPlanForm(!showActionPlanForm)}>
                    {showActionPlanForm ? "Annuler" : "Créer Plan d'Action"}
                  </button>
                </div>

                {showDiagnosticForm && (
                  <div className="diagnostic-form">
                    <h3>Nouveau Diagnostic</h3>
                    <textarea
                      value={newDiagnostic}
                      onChange={(e) => setNewDiagnostic(e.target.value)}
                      placeholder="Entrez votre diagnostic..."
                    />
                    <button onClick={() => submitDiagnostic(selectedUser)}>Enregistrer</button>
                  </div>
                )}

                {showActionPlanForm && (
                  <div className="action-plan-form">
                    <h3>Nouveau Plan d'Action</h3>
                    <input
                      type="text"
                      value={newActionPlan.title}
                      onChange={(e) => setNewActionPlan({ ...newActionPlan, title: e.target.value })}
                      placeholder="Titre"
                    />
                    <textarea
                      value={newActionPlan.description}
                      onChange={(e) => setNewActionPlan({ ...newActionPlan, description: e.target.value })}
                      placeholder="Description"
                    />
                    <input
                      type="date"
                      value={newActionPlan.deadline}
                      onChange={(e) => setNewActionPlan({ ...newActionPlan, deadline: e.target.value })}
                      placeholder="Date limite"
                    />
                    <select
                      value={newActionPlan.status}
                      onChange={(e) => setNewActionPlan({ ...newActionPlan, status: e.target.value })}
                    >
                      <option value="pending">En attente</option>
                      <option value="in-progress">En cours</option>
                      <option value="completed">Terminé</option>
                    </select>
                    <button onClick={() => submitActionPlan(selectedUser)}>Créer Plan</button>
                  </div>
                )}

                <div className="user-tab-content">
                  <h3>Réponses aux Tests</h3>
                  {users.find(u => u._id === selectedUser)?.testResponses?.length > 0 ? (
                    <div className="test-responses">
                      {users.find(u => u._id === selectedUser).testResponses.map((response, idx) => (
                        <div key={idx} className="test-response">
                          <h4>Test du {new Date(response.date).toLocaleDateString()}</h4>
                          <div className="response-section">
                            <h5>Réponses:</h5>
                            <pre>{JSON.stringify(response.responses, null, 2)}</pre>
                          </div>
                          <div className="ai-analysis">
                            <h5>Analyse IA:</h5>
                            <pre>{JSON.stringify(response.aiAnalysis, null, 2)}</pre>
                          </div>
                          <div className="validation-section">
                            <h5>Validation Coach:</h5>
                            {response.coachValidation ? (
                              <div>
                                <p>Statut: {response.coachValidation.isValid ? "Validé" : "Rejeté"}</p>
                                <p>Notes: {response.coachValidation.coachNotes}</p>
                                <p>Date: {new Date(response.coachValidation.validationDate).toLocaleDateString()}</p>
                              </div>
                            ) : (
                              <div className="validation-form">
                                <button onClick={() => validateAIResponse(selectedUser, response.testId, true, "Analyse validée")}>
                                  Valider
                                </button>
                                <button onClick={() => validateAIResponse(selectedUser, response.testId, false, "Analyse à revoir")}>
                                  Rejeter
                                </button>
                                <textarea
                                  placeholder="Notes du coach..."
                                  onChange={(e) => {
                                    const updatedUsers = [...users];
                                    const userIndex = updatedUsers.findIndex(u => u._id === selectedUser);
                                    updatedUsers[userIndex].testResponses[idx].coachValidation = {
                                      isValid: false,
                                      coachNotes: e.target.value,
                                      validationDate: new Date().toISOString()
                                    };
                                    setUsers(updatedUsers);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Aucune réponse aux tests disponible pour cet utilisateur.</p>
                  )}

                  <h3>Diagnostics</h3>
                  {userDiagnostics.length > 0 ? (
                    <ul className="diagnostics-list">
                      {userDiagnostics.map((diag) => (
                        <li key={diag._id} className="diagnostic-item">
                          <div className="diagnostic-header">
                            <span className="diagnostic-date">{new Date(diag.date).toLocaleDateString()}</span>
                          </div>
                          <div className="diagnostic-content">
                            <h4>Diagnostic:</h4>
                            <p>{diag.diagnostic}</p>
                            {diag.aiAnalysis && (
                              <>
                                <h4>Analyse IA:</h4>
                                <pre>{JSON.stringify(diag.aiAnalysis, null, 2)}</pre>
                              </>
                            )}
                            {diag.coachNotes && (
                              <>
                                <h4>Notes du Coach:</h4>
                                <p>{diag.coachNotes}</p>
                              </>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun diagnostic disponible pour cet utilisateur.</p>
                  )}

                  <h3>Plans d'Action</h3>
                  {actionPlans.filter(plan => plan.userId === selectedUser).length > 0 ? (
                    <ul className="action-plans-list">
                      {actionPlans.filter(plan => plan.userId === selectedUser).map((plan) => (
                        <li key={plan._id} className="action-plan-item">
                          <div className="plan-header">
                            <h4>{plan.title}</h4>
                            <span className={`status ${plan.status}`}>{plan.status}</span>
                            <span className="deadline">Échéance: {new Date(plan.deadline).toLocaleDateString()}</span>
                          </div>
                          <div className="plan-description">
                            <p>{plan.description}</p>
                          </div>
                          <div className="progress-updates">
                            <h5>Suivi:</h5>
                            {plan.progressUpdates.length > 0 ? (
                              <ul>
                                {plan.progressUpdates.map((update, idx) => (
                                  <li key={idx}>
                                    <span className="update-date">{new Date(update.date).toLocaleDateString()}:</span>
                                    <span className="update-note">{update.note}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>Aucun suivi enregistré.</p>
                            )}
                            <div className="add-update">
                              <input
                                type="text"
                                placeholder="Ajouter une note de suivi..."
                                onKeyPress={(e) => {
                                  if (e.key === "Enter" && e.target.value) {
                                    addProgressUpdate(plan._id, e.target.value);
                                    e.target.value = "";
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun plan d'action disponible pour cet utilisateur.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "diagnostics" && (
        <div className="diagnostics-section">
          <h2>Tous les Diagnostics</h2>
          {diagnostics.length > 0 ? (
            <ul className="diagnostics-list">
              {diagnostics.map((diag) => (
                <li key={diag._id} className="diagnostic-item">
                  <div className="diagnostic-header">
                    <span className="diagnostic-user">
                      {diag.userName || "Utilisateur inconnu"}
                    </span>
                    <span className="diagnostic-date">{new Date(diag.date).toLocaleDateString()}</span>
                  </div>
                  <div className="diagnostic-content">
                    <h4>Diagnostic:</h4>
                    <p>{diag.diagnostic}</p>
                    {diag.aiAnalysis && (
                      <>
                        <h4>Analyse IA:</h4>
                        <pre>{JSON.stringify(diag.aiAnalysis, null, 2)}</pre>
                      </>
                    )}
                    {diag.coachNotes && (
                      <>
                        <h4>Notes du Coach:</h4>
                        <p>{diag.coachNotes}</p>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun diagnostic disponible.</p>
          )}
        </div>
      )}

      {activeTab === "action-plans" && (
        <div className="action-plans-section">
          <h2>Tous les Plans d'Action</h2>
          {actionPlans.length > 0 ? (
            <ul className="action-plans-list">
              {actionPlans.map((plan) => (
                <li key={plan._id} className="action-plan-item">
                  <div className="plan-header">
                    <h4>{plan.title}</h4>
                    <span className="plan-user">{plan.userName}</span>
                    <span className={`status ${plan.status}`}>{plan.status}</span>
                    <span className="deadline">Échéance: {new Date(plan.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="plan-description">
                    <p>{plan.description}</p>
                  </div>
                  <div className="progress-updates">
                    <h5>Suivi:</h5>
                    {plan.progressUpdates.length > 0 ? (
                      <ul>
                        {plan.progressUpdates.map((update, idx) => (
                          <li key={idx}>
                            <span className="update-date">{new Date(update.date).toLocaleDateString()}:</span>
                            <span className="update-note">{update.note}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Aucun suivi enregistré.</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun plan d'action disponible.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CoachDashboard;
