// src/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller'); // Verifica esta ruta
const router = express.Router();

// Ruta para mostrar el formulario de login (GET)
router.get('/login', authController.getLoginPage); // <-- ¿Está esta línea?

// Ruta para procesar el formulario de login (POST)
router.post('/login', authController.postLogin);

// Ruta para cerrar sesión (GET)
router.get('/logout', authController.logout);

module.exports = router;