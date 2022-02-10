const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../schemas/User');
const passport = require('passport');
const { checkLoggedIn, checkNotLoggedIn } = require('../authorisation');

router.get('/', checkLoggedIn, async (req, res) => {
    return res.json(await User.find());
});

router.get('/register', checkNotLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.post('/register', async (req, res) => {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });
    user.setPassword(req.body.password);

    await user.save();

    res.redirect('/users/login');
});

router.get('/login',checkNotLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}));

router.delete('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
});

module.exports = router;