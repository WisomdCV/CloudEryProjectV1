    // src/routes/admin.routes.js

    const express = require('express');
    const adminController = require('../controllers/admin.controller'); // Importar el controlador admin
    const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware'); // Importar ambos middlewares

    const router = express.Router();

    // --- Rutas de Gestión de Usuarios ---

    // GET /admin/users : Muestra la lista de usuarios (protegida para admins)
    // Primero verifica si está autenticado, luego si es admin, y finalmente llama al controlador.
    router.get('/users', isAuthenticated, isAdmin, adminController.getUserListPage);
    router.get('/users/new', isAuthenticated, isAdmin, adminController.getCreateUserPage);
    router.post('/users/create', isAuthenticated, isAdmin, adminController.postCreateUser);
    router.get('/users/:id/edit', isAuthenticated, isAdmin, adminController.getEditUserPage);
    router.post('/users/:id/update', isAuthenticated, isAdmin, adminController.postUpdateUser);
    router.post('/users/:id/delete', isAuthenticated, isAdmin, adminController.postDeleteUser);

    // --- Aquí añadiremos las rutas para CREATE, UPDATE, DELETE más adelante ---
    // router.get('/users/new', isAuthenticated, isAdmin, adminController.getCreateUserPage);
    // router.post('/users/create', isAuthenticated, isAdmin, adminController.postCreateUser);
    // router.get('/users/:id/edit', isAuthenticated, isAdmin, adminController.getEditUserPage);
    // router.post('/users/:id/update', isAuthenticated, isAdmin, adminController.postUpdateUser);
    // router.post('/users/:id/delete', isAuthenticated, isAdmin, adminController.postDeleteUser);


    module.exports = router; // Exportar el router
    