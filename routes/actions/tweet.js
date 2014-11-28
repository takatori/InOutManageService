var config = require("../../config");
var http = require("../../utils/http.js");
var user = require('../user');

exports.exec = function(user_id, tweet_str, callback) {

    user.loadById(user_id, function(err, user_data){

        tweet_str = replaceAll(tweet_str, "[user]", user_data.screen_name);
        var encoded_tweet =  encodeURIComponent(tweet_str);
        var tweet_url = config.actions.tweet.url + encoded_tweet;

        http.get(tweet_url, function(err) {
            if(err) {
                return callback(err);
            }
        });
    });
};


// すべての文字列 org を dest に置き換える
function replaceAll(expression, org, dest) {
    try {
        return expression.split(org).join(dest);
    } catch(e) {
        console.log(e);
    }
}