const User = require('../models/user.model');

exports.getUserListPage = async (req, res, next) => {
    try {
        const searchTerm = req.query.search || '';
        const users = await User.findAll(searchTerm);
        res.render('admin/user_list', {
            pageTitle: 'Gestión de Usuarios',
            users: users,
            searchTerm: searchTerm,
            user: req.session.user
        });
    } catch (error) {
        next(error);
    }
};

exports.getCreateUserPage = (req, res) => {
    res.render('admin/user_form', {
        pageTitle: 'Crear Nuevo Usuario',
        editing: false,
        userData: {},
        errorMessage: null,
        user: req.session.user
    });
};

exports.postCreateUser = async (req, res, next) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
        return res.status(400).render('admin/user_form', {
            pageTitle: 'Crear Nuevo Usuario',
            editing: false,
            userData: { username, email, role },
            errorMessage: 'Todos los campos son obligatorios.',
            user: req.session.user
        });
    }
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).render('admin/user_form', {
                pageTitle: 'Crear Nuevo Usuario',
                editing: false,
                userData: { username, email, role },
                errorMessage: 'El correo electrónico ya está registrado.',
                user: req.session.user
            });
        }
        await User.create({ username, email, password, role });
        res.redirect('/admin/users');
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            let message = 'Error al crear usuario.';
            if (error.message.includes('email')) {
                message = 'El correo electrónico ya está registrado.';
            } else if (error.message.includes('username')) {
                message = 'El nombre de usuario ya está en uso.';
            }
            return res.status(400).render('admin/user_form', {
                pageTitle: 'Crear Nuevo Usuario',
                editing: false,
                userData: { username, email, role },
                errorMessage: message,
                user: req.session.user
            });
        }
        next(error);
    }
};

exports.getEditUserPage = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userToEdit = await User.findById(userId);
        if (!userToEdit) {
            return res.redirect('/admin/users');
        }
        res.render('admin/user_form', {
            pageTitle: 'Editar Usuario',
            editing: true,
            userData: userToEdit,
            errorMessage: null,
            user: req.session.user
        });
    } catch (error) {
        next(error);
    }
};

exports.postUpdateUser = async (req, res, next) => {
    const userId = req.params.id;
    const { username, email, password, role } = req.body;
    if (!username || !email || !role) {
        const userToEdit = await User.findById(userId);
        return res.status(400).render('admin/user_form', {
            pageTitle: 'Editar Usuario',
            editing: true,
            userData: { ...userToEdit, username, email, role },
            errorMessage: 'Nombre de usuario, email y rol son obligatorios.',
            user: req.session.user
        });
    }
    const updateData = { username, email, role };
    if (password) {
        updateData.password = password;
    }
    try {
        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail && existingUserByEmail.id !== parseInt(userId, 10)) {
            const userToEdit = await User.findById(userId);
            return res.status(400).render('admin/user_form', {
                pageTitle: 'Editar Usuario',
                editing: true,
                userData: { ...userToEdit, username, email, role },
                errorMessage: 'El correo electrónico ya está registrado por otro usuario.',
                user: req.session.user
            });
        }
        await User.update(userId, updateData);
        res.redirect('/admin/users');
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const userToEdit = await User.findById(userId);
            let message = 'Error al actualizar usuario.';
            if (error.message.includes('email')) {
                message = 'El correo electrónico ya está registrado por otro usuario.';
            } else if (error.message.includes('username')) {
                message = 'El nombre de usuario ya está en uso por otro usuario.';
            }
            return res.status(400).render('admin/user_form', {
                pageTitle: 'Editar Usuario',
                editing: true,
                userData: { ...userToEdit, username, email, role },
                errorMessage: message,
                user: req.session.user
            });
        }
        next(error);
    }
};

exports.postDeleteUser = async (req, res, next) => {
    try {
        const userIdToDelete = req.params.id;
        const loggedInUserId = req.session.user.id;
        if (parseInt(userIdToDelete, 10) === loggedInUserId) {
            return res.redirect('/admin/users');
        }
        const result = await User.deleteById(userIdToDelete);
        res.redirect('/admin/users');
    } catch (error) {
        res.redirect('/admin/users');
    }
};

