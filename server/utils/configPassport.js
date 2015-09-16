var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require('../models/user');

module.exports = function() {

  passport.serializeUser(function(user, done) {
    console.log('User', user);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy({
      usernameField: 'email'
    },
    function(username, password, done) {
    console.log('making to here');
    User.findOne({ email: username }, '+password', function(err, user) {
      console.log('found user', user);
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message:'No user has that email!' });
      }
      user.checkPassword(password, function(err, isMatch) {
        if (err) { return done(err); }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password.' });
        }
      });
    });
  }));

};
