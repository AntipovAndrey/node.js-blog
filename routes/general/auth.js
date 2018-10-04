const isLoggedIn = (req) => req.isAuthenticated();

const ifLoggedIn = url => (req, res, next) => {
    if (isLoggedIn(req)) {
        return next();
    }
    res.redirect(url);
};

module.exports = {
    isLoggedIn,
    ifLoggedIn
};
