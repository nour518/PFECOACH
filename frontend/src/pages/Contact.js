import React, { useState } from "react";
import "../styles.css";


function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simule un envoi (ici tu peux connecter à un backend)
      console.log({ name, email, message });
      alert("Message envoyé !");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      alert("Erreur lors de l'envoi");
    }
  };

  return (
    <div className="container">
      <h2>Contactez-nous</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          className="input textarea"
          placeholder="Votre message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <button className="btn" type="submit">
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default Contact;
