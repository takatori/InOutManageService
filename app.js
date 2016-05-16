// ******************* Module import ***************************************
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http         = require('http');
var mongoose     = require('mongoose');
var session      = require('express-session');

// ******************* Service Setting ***************************************
// var config = require('./config');
var routes = require('./routes/index');
var apis   = require('./routes/apis');

var app = express();
var port   = process.env.PORT || 3000;

import config from './config'

// ******************* Logging Setting ***************************************
// fluentd初期化
/*
var fluentLogger = require('fluent-logger').configure('inout', {
    host: config.fluentd.server.ip,
    port: config.fluentd.server.port,
    timeout: config.fluentd.options.timeout
    host: config.get("fluentd.server.ip"),
    port: config.get("fluentd.server.port"),
    timeout: config.get("fluentd.options.timeout")
});*/

// ******************* View Setting ***************************************
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
var ECT = require('ect');
var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext: '.ect'});
app.engine('ect', ectRenderer.render);
app.set('view engine', 'ect');

// ******************* DB Setting ***************************************
// set the 'dbUrl' to the mongodb url that corresponds to the
// environment we are in
// uriの設定
// herokuで利用するときはprocess.env.MONGOLAB_URI
// ローカルではapp.setting.envの設定を利用

app.set('dbUrl', process.env.MONGOLAB_URI || config.db[process.env.NODE_ENV] || 'localhost');

// connect mongoose to the mongo dbUrl
mongoose.connect(app.get('dbUrl'), function(err, res) {
    if (err) {
        // console.log ('ERROR connecting to: ' + app.get('dbUrl') + '.' + err);
    } else {
        // console.log ('Succeeded connecting to: ' + app.get('dbUrl'));
    }
});

// ******************* App Setting ***************************************
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// ******************* Routing Setting ***************************************
app.use('/', routes);
app.use('/apis', apis);

// ******************* Error Handlers ***************************************
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// ******************* App Setting ***************************************
app.listen(port);
module.exports = app;
