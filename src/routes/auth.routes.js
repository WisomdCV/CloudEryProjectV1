// src/routes/auth.routes.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;