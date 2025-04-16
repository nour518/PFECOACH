import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { FaSyncAlt, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

import './admindashboard.css';
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: '',
    name: '',
    category: '',
    options: [],
    correctAnswer: ''
  });
  const [editingQuestion, setEditingQuestion] = useState(null);

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5002',
    timeout: 10000,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return config;
  });

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== 'admin') {
        throw new Error('Accès refusé : droits insuffisants');
      }
      const response = await api.get('/api/admin/users');
      setUsers(response.data?.data || []);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
      setUsers([]);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/api/admin/questions');
      setQuestions(response.data?.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des questions');
      setQuestions([]);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchUsers(), fetchQuestions()]);
      toast.success('Données actualisées');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des données');
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      const response = await api.delete(`/api/admin/users/${userId}`);
      if (response.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error('Erreur suppression utilisateur');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Supprimer cette question ?")) return;
    try {
      const response = await api.delete(`/api/admin/questions/${questionId}`);
      if (response.data.success) {
        setQuestions(questions.filter((q) => q._id !== questionId));
        toast.success('Question supprimée');
      }
    } catch (error) {
      toast.error('Erreur suppression question');
    }
  };

  const handleEditClick = (question) => {
    setEditingQuestion({...question});
    setIsEditModalOpen(true);
  };

  const handleUpdateQuestion = async () => {
    try {
      if (!editingQuestion.question || !editingQuestion.type || 
          !editingQuestion.name || !editingQuestion.category) {
        toast.error("Tous les champs obligatoires doivent être remplis");
        return;
      }

      const response = await api.put(`/api/admin/questions/${editingQuestion._id}`, editingQuestion);
      
      if (response.data.success) {
        setQuestions(questions.map(q => 
          q._id === editingQuestion._id ? response.data.data : q
        ));
        toast.success("Question mise à jour avec succès");
        setIsEditModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const handleAddQuestion = async () => {
    const { question, type, name, category } = newQuestion;
    
    // Validation améliorée
    if (!question || !type || !name || !category) {
      toast.error("Tous les champs obligatoires doivent être remplis");
      return;
    }
  
    // Validation spécifique au type
    if (type === 'multiple' && (!newQuestion.options || !newQuestion.options.length)) {
      toast.error("Veuillez ajouter des options pour les questions à choix multiple");
      return;
    }
  
    if ((type === 'multiple' || type === 'boolean') && !newQuestion.correctAnswer) {
      toast.error("Veuillez spécifier une réponse correcte");
      return;
    }
  
    try {
      const questionToSend = {
        question,
        type,
        name,
        category,
        ...(type === 'multiple' && { 
          options: newQuestion.options,
          correctAnswer: newQuestion.correctAnswer 
        }),
        ...(type === 'boolean' && { 
          correctAnswer: newQuestion.correctAnswer 
        })
      };
  
      console.log("Données envoyées:", questionToSend); // Pour débogage
  
      const response = await api.post('/api/admin/questions', questionToSend);
      
      if (response.data.success) {
        setQuestions([...questions, response.data.data]);
        toast.success('Question ajoutée avec succès');
        setNewQuestion({
          question: '',
          type: '',
          name: '',
          category: '',
          options: [],
          correctAnswer: ''
        });
        setShowAddModal(false);
      }
    } catch (error) {
      console.error("Erreur détaillée:", error.response);
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de la création de la question');
      }
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredQuestions = questions.filter(q =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2>Admin</h2>
        <ul>
          <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
            Gestion des Utilisateurs
          </li>
          <li className={activeTab === 'questions' ? 'active' : ''} onClick={() => setActiveTab('questions')}>
            Gestion des Questions
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h1>{activeTab === 'users' ? 'Gestion des Utilisateurs' : 'Gestion des Questions'}</h1>
          <div className="controls">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={refreshData} className="refresh-btn">
              <FaSyncAlt /> Actualiser
            </button>
            {activeTab === 'questions' && (
              <button className="add-btn" onClick={() => setShowAddModal(true)}>
                <FaPlus /> Ajouter
              </button>
            )}
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        {activeTab === 'users' && (
          <div className="table-container">
            {filteredUsers.length === 0 ? (
              <p className="no-data">Aucun utilisateur trouvé</p>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Date d'inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name || 'Non spécifié'}</td>
                      <td>{user.email}</td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="table-container">
            {filteredQuestions.length === 0 ? (
              <p className="no-data">Aucune question trouvée</p>
            ) : (
              <table className="questions-table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Catégorie</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((question) => (
                    <tr key={question._id}>
                      <td>{question.question}</td>
                      <td>{question.category}</td>
                      <td>{question.type}</td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEditClick(question)}>
                          <FaEdit />
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteQuestion(question._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Ajouter une question</h2>
            <div className="form-group">
              <label>Question</label>
              <input
                type="text"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={newQuestion.type}
                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
              >
                <option value="">Sélectionnez le type</option>
                <option value="boolean">Vrai/Faux</option>
                <option value="text">Texte libre</option>
                <option value="multiple">Multiple</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={newQuestion.name}
                onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Catégorie</label>
              <input
                type="text"
                value={newQuestion.category}
                onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
              />
            </div>
            {newQuestion.type === 'multiple' && (
              <>
                <div className="form-group">
                  <label>Options</label>
                  <textarea
                    value={newQuestion.options.join(',')}
                    onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value.split(',') })}
                  />
                </div>
                <div className="form-group">
                  <label>Réponse correcte</label>
                  <input
                    type="text"
                    value={newQuestion.correctAnswer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                  />
                </div>
              </>
            )}
            {newQuestion.type === 'boolean' && (
              <div className="form-group">
                <label>Réponse correcte</label>
                <select
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                >
                  <option value="true">Vrai</option>
                  <option value="false">Faux</option>
                </select>
              </div>
            )}
            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)}>Annuler</button>
              <button onClick={handleAddQuestion}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {isEditModalOpen && editingQuestion && (
        <div className="modal">
          <div className="modal-content">
            <h2>Modifier la Question</h2>
            <div className="form-group">
              <label>Question</label>
              <input
                type="text"
                value={editingQuestion.question}
                onChange={(e) => setEditingQuestion({
                  ...editingQuestion,
                  question: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={editingQuestion.type}
                onChange={(e) => setEditingQuestion({
                  ...editingQuestion,
                  type: e.target.value
                })}
              >
                <option value="boolean">Vrai/Faux</option>
                <option value="text">Texte libre</option>
                <option value="multiple">Multiple</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={editingQuestion.name}
                onChange={(e) => setEditingQuestion({
                  ...editingQuestion,
                  name: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Catégorie</label>
              <input
                type="text"
                value={editingQuestion.category}
                onChange={(e) => setEditingQuestion({
                  ...editingQuestion,
                  category: e.target.value
                })}
              />
            </div>
            {editingQuestion.type === 'multiple' && (
              <>
                <div className="form-group">
                  <label>Options (séparées par des virgules)</label>
                  <input
                    type="text"
                    value={editingQuestion.options?.join(',') || ''}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      options: e.target.value.split(',')
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Réponse correcte</label>
                  <input
                    type="text"
                    value={editingQuestion.correctAnswer}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      correctAnswer: e.target.value
                    })}
                  />
                </div>
              </>
            )}
            {editingQuestion.type === 'boolean' && (
              <div className="form-group">
                <label>Réponse correcte</label>
                <select
                  value={editingQuestion.correctAnswer}
                  onChange={(e) => setEditingQuestion({
                    ...editingQuestion,
                    correctAnswer: e.target.value
                  })}
                >
                  <option value="true">Vrai</option>
                  <option value="false">Faux</option>
                </select>
              </div>
            )}
            {editingQuestion?.type === 'text' && (
  <div className="form-group">
    <p>Question de type texte libre - pas de réponse à définir</p>
  </div>)}
            <div className="modal-actions">
              <button onClick={() => setIsEditModalOpen(false)}>Annuler</button>
              <button onClick={handleUpdateQuestion}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;