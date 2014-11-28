// // fluentd初期化
// var fluentLogger = require('fluent-logger').configure('inout', {
//   host: "wsapp",
//   port: 24224,
//   timeout: 3.0
// });
var fluentLogger = require('fluent-logger');

exports.send = function(msg) {
    console.log(msg);
    fluentLogger.emit('log', {record : msg});
};
