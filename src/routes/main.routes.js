    // src/routes/main.routes.js

    const express = require('express');
    const mainController = require('../controllers/main.controller');
    const { isAuthenticated } = require('../middlewares/auth.middleware'); // Importar middleware

    const router = express.Router();

    // Ruta raíz: Muestra home o login dependiendo del estado de sesión
    router.get('/', mainController.getRootPage);

    // Ruta Home explícita: protegida, requiere login
    // Si un usuario logueado va a /home directamente, funciona.
    // Si un usuario no logueado va a /home, isAuthenticated lo redirige a /login.
    router.get('/home', isAuthenticated, mainController.getHomePage);

    module.exports = router;
    