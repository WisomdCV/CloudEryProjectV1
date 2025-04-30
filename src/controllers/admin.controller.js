    // src/controllers/admin.controller.js

    const User = require('../models/user.model'); // Importar el modelo de usuario

    /**
     * Muestra la página de gestión de usuarios con la lista de usuarios.
     * Permite filtrar por un término de búsqueda.
     */
    exports.getUserListPage = async (req, res, next) => {
        try {
            // Obtener el término de búsqueda desde la query string (?search=...)
            const searchTerm = req.query.search || '';

            // Obtener todos los usuarios (o los filtrados) desde el modelo
            const users = await User.findAll(searchTerm);

            // Renderizar la vista de la lista de usuarios
            res.render('admin/user_list', { // Busca views/admin/user_list.ejs
                pageTitle: 'Gestión de Usuarios',
                users: users, // Pasar la lista de usuarios a la vista
                searchTerm: searchTerm, // Pasar el término de búsqueda actual a la vista
                user: req.session.user // Pasar info del usuario logueado para la navbar/header
            });
        } catch (error) {
            // Si hay un error al buscar usuarios, pasarlo al manejador de errores
            next(error);
        }
    };

    // CREACION DE USUARIOS
    exports.getCreateUserPage = (req, res) => {
        res.render('admin/user_form', { // Busca views/admin/user_form.ejs
            pageTitle: 'Crear Nuevo Usuario',
            editing: false, // Indicador para la vista (no estamos editando)
            userData: {}, // Objeto vacío para datos iniciales del formulario
            errorMessage: null, // Para mostrar errores de validación
            user: req.session.user // Info del admin para la navbar/header
        });
    };

    /**
     * Procesa los datos del formulario para crear un nuevo usuario.
     */
    exports.postCreateUser = async (req, res, next) => {
        const { username, email, password, role } = req.body;

        // Validación básica (se podría mejorar con express-validator)
        if (!username || !email || !password || !role) {
            return res.status(400).render('admin/user_form', {
                pageTitle: 'Crear Nuevo Usuario',
                editing: false,
                userData: { username, email, role }, // Devolver datos ingresados (sin password)
                errorMessage: 'Todos los campos son obligatorios.',
                user: req.session.user
            });
        }

        // Verificar si el email o username ya existen (opcional pero recomendado)
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
             // Podrías añadir una verificación similar para el username si es necesario

            // Crear el usuario en la base de datos
            await User.create({ username, email, password, role });

            // Redirigir a la lista de usuarios después de crear
            // Opcional: Añadir mensaje flash de éxito aquí si usas connect-flash
            res.redirect('/admin/users');

        } catch (error) {
             // Manejar errores específicos (ej: violación de constraint UNIQUE)
            if (error.code === 'ER_DUP_ENTRY') {
                 // Determinar si fue por email o username basado en el mensaje de error
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
            // Pasar otros errores al manejador global
            next(error);
        }
    };

    // EDITAR USUARIO EXISTENTE
    exports.getEditUserPage = async (req, res, next) => {
        try {
            const userId = req.params.id; // Obtener el ID del usuario de los parámetros de la ruta
            const userToEdit = await User.findById(userId); // Buscar usuario por ID (sin password_hash)

            if (!userToEdit) {
                // Si no se encuentra el usuario, redirigir o mostrar error 404
                // Por simplicidad, redirigimos a la lista
                return res.redirect('/admin/users');
            }

            // Renderizar la misma vista de formulario, pero con datos y modo edición
            res.render('admin/user_form', {
                pageTitle: 'Editar Usuario',
                editing: true, // Indicar que estamos editando
                userData: userToEdit, // Pasar los datos del usuario encontrado
                errorMessage: null,
                user: req.session.user // Info del admin para la navbar
            });

        } catch (error) {
            next(error);
        }
    };

    exports.postUpdateUser = async (req, res, next) => {
        const userId = req.params.id; // ID del usuario a actualizar
        const { username, email, password, role } = req.body; // Datos del formulario

        // Validación básica (se podría mejorar)
        if (!username || !email || !role) {
             // Buscar datos actuales para re-renderizar el formulario
            const userToEdit = await User.findById(userId);
            return res.status(400).render('admin/user_form', {
                pageTitle: 'Editar Usuario',
                editing: true,
                userData: { ...userToEdit, username, email, role }, // Mantener ID, actualizar con datos fallidos
                errorMessage: 'Nombre de usuario, email y rol son obligatorios.',
                user: req.session.user
            });
        }

        // Preparar objeto con datos a actualizar
        const updateData = { username, email, role };

        // Solo incluir la contraseña si se proporcionó una nueva
        // Si el campo password está vacío, no se actualiza la contraseña
        if (password) {
            updateData.password = password; // El modelo se encargará de hashearla si existe
        }

        try {
            // Verificar si el nuevo email ya está en uso por OTRO usuario
            const existingUserByEmail = await User.findByEmail(email);
            if (existingUserByEmail && existingUserByEmail.id !== parseInt(userId, 10)) {
                 const userToEdit = await User.findById(userId); // Datos originales para el form
                return res.status(400).render('admin/user_form', {
                    pageTitle: 'Editar Usuario',
                    editing: true,
                    userData: { ...userToEdit, username, email, role }, // Mantener ID, actualizar con datos fallidos
                    errorMessage: 'El correo electrónico ya está registrado por otro usuario.',
                    user: req.session.user
                });
            }
             // Podrías añadir verificación similar para username si es necesario

            // Actualizar el usuario en la base de datos
            await User.update(userId, updateData);

            // Redirigir a la lista de usuarios
            // Opcional: Añadir mensaje flash de éxito
            res.redirect('/admin/users');

        } catch (error) {
             // Manejar errores específicos (ej: violación de constraint UNIQUE)
            if (error.code === 'ER_DUP_ENTRY') {
                 const userToEdit = await User.findById(userId); // Datos originales para el form
                let message = 'Error al actualizar usuario.';
                if (error.message.includes('email')) {
                    message = 'El correo electrónico ya está registrado por otro usuario.';
                } else if (error.message.includes('username')) {
                    message = 'El nombre de usuario ya está en uso por otro usuario.';
                }
                return res.status(400).render('admin/user_form', {
                    pageTitle: 'Editar Usuario',
                    editing: true,
                    userData: { ...userToEdit, username, email, role }, // Mantener ID, actualizar con datos fallidos
                    errorMessage: message,
                    user: req.session.user
                });
            }
            // Pasar otros errores al manejador global
            next(error);
        }
    };

    //ELIMINAR USUARIO
    exports.postDeleteUser = async (req, res, next) => {
        try {
            const userIdToDelete = req.params.id; // ID del usuario a eliminar
            const loggedInUserId = req.session.user.id; // ID del usuario admin logueado

            // **Importante: Prevenir que un administrador se elimine a sí mismo**
            if (parseInt(userIdToDelete, 10) === loggedInUserId) {
                console.warn(`Admin (ID: ${loggedInUserId}) intentó eliminarse a sí mismo.`);
                // Podrías mostrar un mensaje de error en lugar de solo redirigir
                // req.flash('error', 'No puedes eliminar tu propia cuenta de administrador.');
                return res.redirect('/admin/users');
            }

            // Llamar al método del modelo para eliminar al usuario
            const result = await User.deleteById(userIdToDelete);

            if (result.affectedRows === 0) {
                // Si no se eliminó ninguna fila, el usuario no existía (raro en este flujo)
                console.warn(`Intento de eliminar usuario inexistente con ID: ${userIdToDelete}`);
                // Podrías añadir un mensaje flash de error
            } else {
                console.log(`Usuario con ID: ${userIdToDelete} eliminado por Admin ID: ${loggedInUserId}`);
                // Opcional: Añadir mensaje flash de éxito
                // req.flash('success', 'Usuario eliminado correctamente.');
            }

            // Redirigir de vuelta a la lista de usuarios
            res.redirect('/admin/users');

        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            // Opcional: Añadir mensaje flash de error general
            // req.flash('error', 'Ocurrió un error al intentar eliminar el usuario.');
            // Pasar el error al manejador global o redirigir
            // next(error); // Podría mostrar una página de error genérica
            res.redirect('/admin/users'); // Redirigir incluso si hay error por simplicidad
        }
    };
    
    