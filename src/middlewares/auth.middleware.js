    // src/middlewares/auth.middleware.js

    /**
     * Middleware para verificar si el usuario ha iniciado sesión.
     * Si no ha iniciado sesión, redirige a la página de login,
     * a menos que ya esté intentando acceder a /login.
     */
    exports.isAuthenticated = (req, res, next) => {
        // Si existe la sesión del usuario, continuar
        if (req.session.user) {
            return next();
        }

        // Si NO hay sesión Y el usuario YA está intentando acceder a /login,
        // dejar que continúe (para que se renderice la página de login).
        if (req.path === '/login') {
            return next();
        }

        // Si NO hay sesión y NO está en /login, redirigir a /login.
        res.redirect('/login');
    };

    /**
     * Middleware para verificar si el usuario es administrador.
     * Debe usarse *después* de isAuthenticated.
     * Si no es admin, redirige a /home.
     */
    exports.isAdmin = (req, res, next) => {
        // Se asume que isAuthenticated ya verificó la sesión.
        // Doble chequeo por si acaso.
        if (!req.session.user) {
            return res.redirect('/login');
        }

        if (req.session.user.role === 'admin') {
            // Si el usuario es admin, continuar
            return next();
        }

        // Si no es admin, redirigir a home.
        // Podríamos añadir una comprobación similar a req.path === '/home'
        // si el bucle persistiera, pero probemos sin ella primero.
        res.redirect('/home');
    };
    