const LocalStrategy = require('passport-local');
const User = require('./schemas/User');

function initialise(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            var user = await User.findOne({ email: email });

            if (user && user.comparePassword(password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Incorrect username or password.' })
            }
        } catch(err) {
            return done(err);
        }                
    }));

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => done(null, await User.findById(id)));
}

module.exports = initialise;