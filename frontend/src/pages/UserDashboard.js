import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [diagnostic, setDiagnostic] = useState("");
  const [activeTab, setActiveTab] = useState("diagnostic");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [planAction, setPlanAction] = useState({
    tasks: [
      {
        description: "Mettre en place une routine matinale",
        status: "Non commencé",
        dueDate: "15/03/2025"
      },
      {
        description: "Pratiquer la méditation 10 minutes par jour",
        status: "En cours",
        dueDate: "20/03/2025"
      }
    ]
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const loggedInUser = localStorage.getItem("user");
        if (!loggedInUser) {
          navigate("/login");
          return;
        }

        const userData = JSON.parse(loggedInUser);
        setUser(userData);

        // Récupérer le diagnostic
        await fetchDiagnostic(userData);

        // Récupérer les messages
        await fetchMessages(userData);

        // Récupérer le plan d'action
        await fetchPlanAction(userData);

      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError(error.message || "Une erreur s'est produite lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchDiagnostic = async (userData) => {
    try {
      const diagnosticResponse = await fetch(
        `http://localhost:5002/api/diagnostics/diagnostic/${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!diagnosticResponse.ok) {
        if (diagnosticResponse.status === 404) {
          // C'est normal si l'utilisateur n'a pas encore de diagnostic
          console.log("Aucun diagnostic trouvé pour cet utilisateur.");
          return;
        }
        const errorData = await diagnosticResponse.json();
        throw new Error(errorData.message || "Erreur lors de la récupération du diagnostic");
      }

      const diagnosticData = await diagnosticResponse.json();
      if (diagnosticData && diagnosticData.diagnostic) {
        setDiagnostic(diagnosticData.diagnostic.content || diagnosticData.diagnostic);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du diagnostic:", error);
      // Ne pas définir d'erreur globale ici pour ne pas bloquer le reste de l'interface
    }
  };

  const fetchMessages = async (userData) => {
    try {
      const messagesResponse = await fetch(
        `http://localhost:5002/api/messages/conversation/${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!messagesResponse.ok) {
        if (messagesResponse.status === 404) {
          // C'est normal si l'utilisateur n'a pas encore de messages
          console.log("Aucun message trouvé pour cet utilisateur.");
          return;
        }
        const errorData = await messagesResponse.json();
        throw new Error(errorData.message || "Erreur lors de la récupération des messages");
      }

      const messagesData = await messagesResponse.json();
      if (messagesData && Array.isArray(messagesData)) {
        const formattedMessages = messagesData.map((msg) => ({
          id: msg._id || Date.now(),
          sender: msg.sender === userData._id ? "user" : "coach",
          text: msg.content || "Message vide",
          timestamp: msg.date 
            ? new Date(msg.date).toLocaleString() 
            : new Date().toLocaleString(),
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
      // Ne pas définir d'erreur globale ici pour ne pas bloquer le reste de l'interface
    }
  };

  const fetchPlanAction = async (userData) => {
    try {
      const planActionResponse = await fetch(
        `http://localhost:5002/api/plan-actions/plan-action/${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!planActionResponse.ok) {
        if (planActionResponse.status === 404) {
          // C'est normal si l'utilisateur n'a pas encore de plan d'action
          console.log("Aucun plan d'action trouvé pour cet utilisateur.");
          return;
        }
        const errorData = await planActionResponse.json();
        throw new Error(errorData.message || "Erreur lors de la récupération du plan d'action");
      }

      const planActionData = await planActionResponse.json();
      if (planActionData && planActionData.tasks) {
        setPlanAction(planActionData);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du plan d'action:", error);
      // Ne pas définir d'erreur globale ici pour ne pas bloquer le reste de l'interface
    }
  };

  const handleDownloadDiagnostic = () => {
    if (!diagnostic) {
      setError("Aucun diagnostic disponible à télécharger.");
      return;
    }
    
    const blob = new Blob([diagnostic], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagnostic-coaching.txt";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      setError("Le message ne peut pas être vide");
      return;
    }
  
    setIsSending(true);
    setError(null);
  
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.token) {
        throw new Error("Session expirée, veuillez vous reconnecter");
      }
  
      // Préparer les données du message
      const messageData = {
        content: newMessage,
      };
  
      // Si l'utilisateur a un coach assigné, l'utiliser comme destinataire
      if (userData.coach) {
        messageData.receiver = userData.coach;
      }
  
      const response = await fetch("http://localhost:5002/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(messageData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de l'envoi du message");
      }
  
      const savedMessage = await response.json();
      
      // Ajouter le message à la liste des messages
      const newMessageObj = {
        id: savedMessage.data?._id || Date.now(),
        sender: "user",
        text: savedMessage.data?.content || newMessage,
        timestamp: new Date().toLocaleString()
      };
      
      setMessages(prev => [...prev, newMessageObj]);
      setNewMessage("");
      
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      setError(error.message || "Erreur lors de l'envoi du message");
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      setError(null);
      const userData = JSON.parse(localStorage.getItem("user"));
      
      const response = await fetch(`http://localhost:5002/api/plan-actions/plan-action/${userData._id}/task/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          completed: status === "Terminé"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour du statut");
      }

      // Mettre à jour l'état local
      setPlanAction(prevPlan => {
        const updatedTasks = prevPlan.tasks.map(task => 
          task._id === taskId ? { ...task, status } : task
        );
        return { ...prevPlan, tasks: updatedTasks };
      });

    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      setError(error.message || "Une erreur s'est produite lors de la mise à jour.");
    }
  };

  const handleSaveActionPlan = async () => {
    try {
      setError(null);
      const userData = JSON.parse(localStorage.getItem("user"));
      
      // Convertir les tâches au format attendu par l'API
      const tasksForApi = planAction.tasks.map(task => ({
        description: task.description,
        completed: task.status === "Terminé",
        dueDate: new Date(task.dueDate.split('/').reverse().join('-'))
      }));
      
      const response = await fetch("http://localhost:5002/api/plan-actions/plan-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          userId: userData._id,
          tasks: tasksForApi
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la sauvegarde");
      }

      alert("Plan d'action sauvegardé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(error.message || "Une erreur s'est produite lors de la sauvegarde.");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Fermer</button>
        </div>
      )}

      <div className="header">
        <h1>Bienvenue, {user?.name || "Utilisateur"}</h1>
        <p>Votre espace personnel de coaching</p>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "diagnostic" ? "active" : ""}
          onClick={() => setActiveTab("diagnostic")}
        >
          Diagnostic
        </button>
        <button
          className={activeTab === "plan" ? "active" : ""}
          onClick={() => setActiveTab("plan")}
        >
          Plan d'Action
        </button>
        <button
          className={activeTab === "messages" ? "active" : ""}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>
      </div>

      <div className="content">
        {activeTab === "diagnostic" && (
          <div className="diagnostic">
            <div className="diagnostic-header">
              <h2>Votre Diagnostic</h2>
              <button onClick={handleDownloadDiagnostic} disabled={!diagnostic}>Télécharger</button>
            </div>
            <div className="diagnostic-content">
              {diagnostic ? diagnostic : "Aucun diagnostic disponible. Veuillez contacter votre coach pour en obtenir un."}
            </div>
          </div>
        )}

        {activeTab === "plan" && (
          <div className="plan">
            <h2>Votre Plan d'Action</h2>
            {planAction.tasks && planAction.tasks.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Objectif</th>
                      <th>Statut</th>
                      <th>Échéance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planAction.tasks.map((task, index) => (
                      <tr key={task._id || index}>
                        <td>{task.description}</td>
                        <td>
                          <select 
                            value={task.status || (task.completed ? "Terminé" : "En cours")}
                            onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                          >
                            <option>Non commencé</option>
                            <option>En cours</option>
                            <option>Terminé</option>
                          </select>
                        </td>
                        <td>{task.dueDate}</td>
                        <td>
                          <button>Détails</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={handleSaveActionPlan}>Sauvegarder</button>
              </>
            ) : (
              <p>Aucun plan d'action disponible. Veuillez contacter votre coach pour en établir un.</p>
            )}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="messages">
            <h2>Échanges avec votre Coach</h2>
            <div className="messages-list">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.sender}`}>
                    <p>{msg.text}</p>
                    <span className="timestamp">{msg.timestamp}</span>
                  </div>
                ))
              ) : (
                <p>Aucun message disponible. Commencez la conversation avec votre coach!</p>
              )}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isSending}
              />
              <button 
                onClick={handleSendMessage} 
                disabled={isSending || !newMessage.trim()}
              >
                {isSending ? "Envoi en cours..." : "Envoyer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
