const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController'); // Importez les deux fonctions

// Route pour l'inscription
router.post('/signup', register);

// Route pour la connexion
router.post('/login', login);

module.exports = router;