import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CoachDashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Si l'utilisateur n'est pas un coach, redirection
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('/api/coach/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data); // Mise à jour des utilisateurs
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      });
  }, [navigate, token]);

  return (
    <div>
      <h1>Tableau de bord du Coach</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <p>Nom: {user.name}</p>
            <p>Email: {user.email}</p>
            <button onClick={() => navigate(`/user/${user._id}`)}>Consulter</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoachDashboard;
