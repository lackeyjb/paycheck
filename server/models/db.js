var mongoose = require('mongoose');
var gracefulShutdown;
var dbURI = 'mongodb://localhost/paycheck';

if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

/**
 * Connection Events
 */
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ', dbURI);
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ', err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

/**
 * Capture app termination / restart events
 */
gracefulShutdown = function (msg, callback) {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through ' + msg);
  });
  callback();
};
// For nodemon restarts
process.once('SIGURS2', function () {
  gracefulShutdown('nodemon restart', function () {
    process.kill(process.pid, 'SIGURS2');
  });
});
// For app termination
process.on('SIGINT', function () {
  gracefulShutdown('app termination', function () {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function () {
  gracefulShutdown('Heroku app termination', function () {
    process.exit(0);
  });
});

// Bring in schemas
require('./user');
require('./budget');
