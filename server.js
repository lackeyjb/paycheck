var express     = require('express');
var path        = require('path');
var logger      = require('morgan');
var compression = require('compression');
var bodyParser  = require('body-parser');
var httpProxy   = require('http-proxy');
var http        = require('http');
var proxy       = httpProxy.createProxyServer({
  changeOrigin: true,
  ws: true
});
var app          = express();
var isProduction = process.env.NODE_ENV === 'production';
var port         = isProduction ? process.env.PORT : 3000;
var publicPath   = path.resolve(__dirname, 'public');

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(publicPath));

if (!isProduction) {

  var bundle = require('./server/bundle.js');
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

  app.listen(port, function () {
    console.log('Server running on port ' + port);
  });

}
