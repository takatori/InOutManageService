var fluentLogger = require('fluent-logger');

exports.send = function(data) {
    var result = {};
    for (var i = 0; i < data.length; i++) {
        var id = data[i].id;
        var status = data[i].status;
        result[id] = status;
    }
    fluentLogger.emit('log', result);
};
