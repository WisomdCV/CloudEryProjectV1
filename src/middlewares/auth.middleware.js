exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    if (req.path === '/login') {
        return next();
    }
    res.redirect('/login');
};

exports.isAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    if (req.session.user.role === 'admin') {
        return next();
    }
    res.redirect('/home');
};
