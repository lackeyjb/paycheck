var express      = require('express');
var path         = require('path');
var logger       = require('morgan');
var compression  = require('compression');
var mongoose     = require('mongoose');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var flash        = require('connect-flash');
var session      = require('express-session');
var passport     = require('passport');
var httpProxy    = require('http-proxy');
var http         = require('http');
var proxy        = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true
});

var appRoutes      = require('./server/routes/appRoutes');
var configPassport = require('./server/utils/configPassport');
var ensureAuthenticated = require('./server/utils/authMiddleware');

var app          = express();
var isProduction = process.env.NODE_ENV === 'production';
if (isProduction) {
  mongoose.connect(process.env.MONGOLAB_URI);
  app.use(express.static(path.resolve(__dirname, 'build')));
}
if (!isProduction) mongoose.connect('mongodb://localhost/paycheck');
configPassport();
var port         = isProduction ? process.env.PORT : 3000;
var publicPath   = path.resolve(__dirname, 'public');

app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'ejs');
app.use(express.static(publicPath));

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: 'supersecret',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(appRoutes);

if (!isProduction) {

  var bundle = require('./server/utils/bundle.js');
  bundle();
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
        target: 'http://127.0.0.1:3001'
    });
  });
  app.all('/socket.io*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://127.0.0.1:3001'
    });
  });

  app.use(ensureAuthenticated); // must add here because of socketIO calls

  proxy.on('error', function(e) {
    console.error(e);
  });

  var server = http.createServer(app);

  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

  server.listen(port, function () {
    console.log('Server running on port ' + port);
  });

} else {
  app.use(ensureAuthenticated);
  app.listen(port, function () {
    console.log('Server running on port ' + port);
  });

}
