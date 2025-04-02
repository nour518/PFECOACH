require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');

const app = express();
const httpServer = createServer(app);

// Middleware CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Connexion MongoDB unifiée
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coachingdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/diagnostics', require('./middleware/authMiddleware').protect, require('./routes/diagnosticRoutes'));
app.use('/api/messages', require('./middleware/authMiddleware').protect, require('./routes/messageRoutes'));
app.use('/api/plan-actions', require('./middleware/authMiddleware').protect, require('./routes/planActionRoutes'));

// Route de test
app.get('/api/health-check', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API fonctionnelle',
    database: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté'
  });
});

// Gestion des erreurs centralisée
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error('Erreur:', err.stack);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5002;
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur en cours d'exécution sur le port ${PORT}`);
});