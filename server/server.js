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
app.set('view engine', 'ejs'); // Not currently used since move to react, but may use
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/../client/public')));
app.use(express.static(path.join(__dirname, '/../client/bower_components'))); // Still used for bootstap in the non-react html files
app.use(express.static(path.join(__dirname, '/../client/src/css/public')));

const userRouter = require('./routes/user');
app.use('/users', userRouter);

const formRouter = require('./routes/form');
app.use('/forms', formRouter);

app.use('/', checkLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/app-launch.html'));
});

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});