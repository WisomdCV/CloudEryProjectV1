    // src/controllers/main.controller.js

    /**
     * Muestra la página correspondiente en la ruta raíz ('/').
     * - Muestra 'home.ejs' si el usuario está logueado.
     * - Muestra 'auth/login.ejs' si el usuario NO está logueado.
     */
    exports.getRootPage = (req, res) => {
        if (req.session.user) {
            // Usuario logueado: renderizar home
            res.render('home', { // Busca views/home.ejs
                pageTitle: 'Inicio - Ery',
                user: req.session.user
            });
        } else {
            // Usuario no logueado: renderizar login
            res.render('auth/login', { // Busca views/auth/login.ejs
                pageTitle: 'Iniciar Sesión',
                errorMessage: null // No mostrar mensaje de error al cargar inicialmente
            });
        }
    };

    /**
     * Muestra la página principal (home) - Ruta explícita /home.
     * Asegurada por el middleware isAuthenticated.
     */
    exports.getHomePage = (req, res) => {
        // El middleware isAuthenticated ya asegura que req.session.user existe
        const user = req.session.user;
        res.render('home', {
            pageTitle: 'Inicio - Ery',
            user: user
        });
    };

    // La función getRoot original ya no es necesaria con este enfoque.
    