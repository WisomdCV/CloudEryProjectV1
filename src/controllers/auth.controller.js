const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.getLoginPage = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Iniciar Sesión',
        errorMessage: null
    });
};

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
            res.redirect('/home');
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
};
