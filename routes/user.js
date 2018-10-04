const express = require('express');
const router = express.Router();
const User = require('../model/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('user/register');
});

router.post('/register', (req, res, next) => {
    User.register(new User({username: req.body.username}), req.body.password)
        .then(user => {
            passport.authenticate('local', () => res.redirect('/'))(req, res);
        })
        .catch(next);
});

router.get('/login', (req, res) => {
    res.render('user/login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}), (req, res, next) => {
    res.render('user/login');
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
