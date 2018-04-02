const passport = require('passport');
const { Strategy } = require('passport-local');
const db = require('./db');

passport.use('loginUser', new Strategy({
  usernameField: 'username',
  passwordField: 'email',
  passReqToCallback: true,
}, (req, username, password, cb) => {
  db.findUserByUsername(username, (err, user, email) => {
    if (err) {
      return cb(err);
    }
    if (!user) {
      db.addUser(username, password, (error) => {
        if (error) {
          return cb(null, false, { message: 'this email is already registered!' });
        }
      });
    } else if (email !== password) {
      return cb(null, false, { message: 'wrong email!' });
    } else {
      return cb(null, username);
    }
  });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
