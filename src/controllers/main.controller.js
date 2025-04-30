exports.getRootPage = (req, res) => {
    if (req.session.user) {
        res.render('home', {
            pageTitle: 'Inicio - Ery',
            user: req.session.user
        });
    } else {
        res.render('auth/login', {
            pageTitle: 'Iniciar Sesión',
            errorMessage: null
        });
    }
};

exports.getHomePage = (req, res) => {
    const user = req.session.user;
    res.render('home', {
        pageTitle: 'Inicio - Ery',
        user: user
    });
};
