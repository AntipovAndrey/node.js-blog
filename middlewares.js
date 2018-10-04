module.exports = {
    isLoggedIn: (loginUrl) => (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect(loginUrl)
    }
};