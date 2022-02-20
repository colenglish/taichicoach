if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const methodOverride = require('method-override');
const session = require('express-session');
const { checkLoggedIn } = require('./authorisation');

const initialisePassport = require('./passport-config');
initialisePassport(passport);

const PORT = process.env.PORT || 8080;

const app = express();

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

mongoose.connect(process.env.MONGO_URI);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/../client/public')));
app.use(express.static(path.join(__dirname, '/../client/bower_components')));
app.use(express.static(path.join(__dirname, '/../client/src/css/public')));

const userRouter = require('./routes/user');
app.use('/users', userRouter);

const formRouter = require('./routes/form');
app.use('/forms', formRouter);

app.use('/', checkLoggedIn, (req, res) => {
    res.render('index', { name: req.user.firstName })
});

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});