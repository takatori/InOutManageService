var config = require("../../config");
var http = require("../../utils/http.js");

exports.exec = function(url) {
    var sound_url = config.actions.sound.url + url;
    http.get(sound_url, function(err) {
        if(err) new Error('exec sound service error');
    });
};