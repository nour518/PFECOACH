import React, { useEffect, useState } from "react";
import "../styles.css";

const Profil = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        } else {
          console.error("Erreur lors du chargement du profil :", data.message);
        }
      } catch (err) {
        console.error("Erreur :", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages((prev) => [...prev, { sender: "user", content: message }]);
      setMessage("");
    }
  };

  if (!user) return <p>Chargement du profil...</p>;

  return (
    <div className="profil-container">
      <h1>Bienvenue, {user.name}</h1>

      <section className="diagnostic-section">
        <h2>🩺 Diagnostic</h2>
        <p>{user.diagnostic}</p>
      </section>

      <section className="plan-section">
        <h2>📋 Plan d'action</h2>
        <p>{user.planAction}</p>
      </section>

      <section className="chat-section">
        <h2>💬 Messagerie avec le coach</h2>
        <p>Coach assigné : {user.coach ? user.coach.name : "Aucun coach assigné"}</p>

        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={message}
            placeholder="Écrivez un message..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Envoyer</button>
        </div>
      </section>
    </div>
  );
};

export default Profil;
