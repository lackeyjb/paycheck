var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var SALT_FACTOR = 10;
var noop = function () {};

var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  budgetAdmin: {
    type: Boolean,
    default: false
  },
  budgets: [{
    type: Schema.Types.ObjectId,
    ref: 'Budget'
  }]
});

var noop = function() {};

userSchema.pre('save', function(done) {
  var user = this;

  if (!user.isModified('password')) {
    return done();
  }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
      if (err) { return done(err); }
      user.password = hashedPassword;
      done();
    });
  });
});

userSchema.methods.checkPassword = function(guess, done) {
  bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
