
// 必要なモジュールの読み込み
var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
// Load config
var config = require('./config');

// fluentd初期化
var fluentLogger = require('fluent-logger').configure('inout', {
  host: config.fluentd.server.ip,
  port: config.fluentd.server.port,
  timeout: config.fluentd.options.timeout
});


var app = express();
// all environments
app.set('host', config.service.host);
app.set('port', process.env.PORT || config.service.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev')); // 開発中に有効にしておくと良い アクセス情報の表示など
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// エラーハンドリング
app.use(function(err, req, res, next){
  res.status(500);
  res.send(err.message);
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// DB初期化
// Bootstrap db connection
// Connect to mongodb
var connect = function () {
  mongoose.connect(config.database.url, config.database.options);
};
connect();

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect();
});


// Bootstrap models
require('./models/account');

// ====== ルーティング設定 ================================================
var main = require('./routes/index');
var settings = require('./routes/setting');
var api = require('./routes/api');

// 順番がかなり重要
// 例えば，/setting/init に前に /setting/:id を書くと全て/:idにバインドされてしまう

// 初期化
app.get('/setting/init', settings.init);

// 設定系 
app.get('/setting', settings.index);
app.get('/setting/:id', settings.load);
app.post('/setting/:id', settings.addAction);
app.get('/setting/delete/:id', settings.deleteAction);
app.get('/setting/test/:id', settings.testAction);

// アプリ本体
app.get('/inout/:id', main.inout);
app.get('/', main.index);

// APIs
app.get('/api/currentNumberOfPeople', api.getCurrentNumberOfPeople);
app.get('/api/inout/:id', api.inout);
app.get('/api/in/:id', api.in_room);
app.get('/api/out/:id', api.out_room);
app.get('/api/getStatus/:id', api.getStatus);
// ===================================================================


// ハンドルされていない例外が発生してもプログラムを終了させなくする
// できるかぎり利用しないほうが良い
process.on('uncaughtException', function (err) {
    // エラーの内容をコンソールに出力
    console.log(err);
    // スタックトレースをコンソールに出力
    console.trace();
});

http.createServer(app).listen(app.get('port'), app.get('host'), function(){
  console.log('Express server listening on' + app.get('host') + app.get('port'));
});
