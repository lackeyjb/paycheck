var express             = require('express');
var passport            = require('passport');
var router              = express.Router();
var ensureAuthenticated = require('../utils/authMiddleware');

var User = require('../models/user');

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.errors      = req.flash('error');
  res.locals.infos       = req.flash('info');
  next();
});

router.get('/', ensureAuthenticated, function (req, res) {
  console.log('Req user', req.user);
  res.render('index');
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

router.get('/signup', function (req, res) {
  res.render('signup');
});

router.post('/signup', function (req, res, next) {
  var username = req.body.username;
  var email    = req.body.email;
  var password = req.body.password;

  User.findOne({ email: email }, function (err, user) {
    if (err) return next(err);
    if (user) {
      req.flash('error', 'User already exists.');
      return res.redirect('/signup');
    }

    var newUser = new User({
      email: email,
      username: username,
      password: password
    });
    console.log('newUser', newUser);
    newUser.save(next);
  });
}, passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true
}));

module.exports = router;
