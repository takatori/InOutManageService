
var config = require("../config");
var http = require('../utils/http.js');


exports.loadUsers = function(callback) {
    http.getJson(config.users.currentUsers.url, function(err, users) {
        if (err) { console.log(err.stack); return; }
            callback(err, users);
    });
};

exports.loadById = function(id, callback) {
    var url = config.users.person.url + id;
    http.getJson(url, function(error, user_data) {
        if (error) { console.log("user load error: " + error.stack); }
            callback(error, user_data);
    });
};


