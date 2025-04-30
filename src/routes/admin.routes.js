// src/routes/admin.routes.js

const express = require('express');
const adminController = require('../controllers/admin.controller');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/users', isAuthenticated, isAdmin, adminController.getUserListPage);
router.get('/users/new', isAuthenticated, isAdmin, adminController.getCreateUserPage);
router.post('/users/create', isAuthenticated, isAdmin, adminController.postCreateUser);
router.get('/users/:id/edit', isAuthenticated, isAdmin, adminController.getEditUserPage);
router.post('/users/:id/update', isAuthenticated, isAdmin, adminController.postUpdateUser);
router.post('/users/:id/delete', isAuthenticated, isAdmin, adminController.postDeleteUser);

module.exports = router;
