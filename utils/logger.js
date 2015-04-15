var fluentLogger = require('fluent-logger');

exports.send = function(user, state) {
    console.log(user + ' : ' + state );
    fluentLogger.emit('log', {user: user, state: state});
};
