// frontend/src/pages/Register.js
import React, { useState } from "react";
import axios from "axios";
import "../styles.css";

function Register() {
  // Vous pouvez garder ici les champs nécessaires pour une inscription
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", { name, email, password });
      alert("Inscription réussie ! Vous recevrez bientôt votre diagnostic de coach.");
    } catch (err) {
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="container">
      <h2>Inscription pour diagnostic de coach</h2>
      <form onSubmit={handleRegister}>
        <input
          className="input"
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn" type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default Register;
