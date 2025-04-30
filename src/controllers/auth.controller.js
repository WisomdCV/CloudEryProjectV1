    // src/controllers/auth.controller.js

    const User = require('../models/user.model');
    const bcrypt = require('bcrypt');

    /**
     * Muestra la página de inicio de sesión.
     */
    exports.getLoginPage = (req, res) => {
        // // Si ya está logueado, redirigir a home <-- COMENTA O ELIMINA ESTE BLOQUE
        // if (req.session.user) {
        //     return res.redirect('/home');
        // }

        // Renderiza la vista de login.
        res.render('auth/login', {
            pageTitle: 'Iniciar Sesión',
            errorMessage: null
        });
    };

    /**
     * Procesa el intento de inicio de sesión.
     */
    exports.postLogin = async (req, res, next) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('auth/login', {
                pageTitle: 'Iniciar Sesión',
                errorMessage: 'Por favor, introduce email y contraseña.'
            });
        }

        try {
            const user = await User.findByEmail(email);

            if (!user) {
                return res.status(401).render('auth/login', {
                    pageTitle: 'Iniciar Sesión',
                    errorMessage: 'Credenciales inválidas.'
                });
            }

            const passwordMatch = await bcrypt.compare(password, user.password_hash);

            if (!passwordMatch) {
                return res.status(401).render('auth/login', {
                    pageTitle: 'Iniciar Sesión',
                    errorMessage: 'Credenciales inválidas.'
                });
            }

            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role
            };

            req.session.save(err => {
                if (err) {
                    return next(err);
                }
                res.redirect('/home'); // Redirige a /home después del login exitoso
            });

        } catch (error) {
            next(error);
        }
    };

    /**
     * Cierra la sesión del usuario.
     */
    exports.logout = (req, res, next) => {
        req.session.destroy(err => {
            if (err) {
                return next(err);
            }
            res.redirect('/login');
        });
    };
    