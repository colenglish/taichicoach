module.exports = {
    checkLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/users/login');
    },
    checkNotLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/');
        }

        next();
    }
};