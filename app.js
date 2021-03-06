const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const sanitizer = require('express-sanitizer');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local');

mongoose.plugin(function (schema) {
    schema.statics.isObjectId = function (id) {
        if (id) {
            return /^[0-9a-fA-F]{24}$/.test(id);
        }
        return false;
    };
});


mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

const app = express();

// view engine setup
require('./hbshelpers');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(sanitizer());

app.use(require('express-session')({
    secret: "My Frog is the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
const User = require('./model/user');
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    return next();
});

app.use('/', require('./routes/index'));
app.use('/', require('./routes/user'));
app.use('/blogs', require('./routes/blog'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    const status = !err.status ? 500 : err.status;
    res.status(status)
        .render('error', {
            message: err.message,
            error: req.app.get('env') === 'development' ? err : {},
            status: status
        });
});

module.exports = app;
