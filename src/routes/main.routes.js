// src/routes/main.routes.js

const express = require('express');
const mainController = require('../controllers/main.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const router = express.Router();
router.get('/', mainController.getRootPage);
router.get('/home', isAuthenticated, mainController.getHomePage);
module.exports = router;
