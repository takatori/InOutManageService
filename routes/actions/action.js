var mongoose = require('mongoose');
var Account = mongoose.model('accounts');
var random = require('../../utils/random');

var voice = require('./voice');
var sound = require('./sound');
var tweet = require('./tweet');


exports.testAction = function(type, contents, user_id) {
    if(type === "voice") {
        voice.exec(user_id, contents);
    } else if(type === "sound") {
        sound.exec(contents);
    } else {
        tweet.exec(user_id, contents, function(err) {});
    }
};

exports.execInAction = function(user_id) {
    Account.load(user_id, function(err, account){
        // 入室or退出時のAction部分だけ取り出し 
        if(account.in_actions) execActions(account.in_actions, user_id);
    });
};

exports.execOutAction = function(user_id) {
    Account.load(user_id, function(err, account){
        if(account.out_actions) execActions(account.out_actions, user_id);
    });
};



function execActions(actions, user_id) {
        //　タイプごとにフィルタリング
        var voice_list = filterAction("voice", actions);
        var sound_list = filterAction("sound", actions);
        var tweet_list = filterAction("tweet", actions);

        // speakerを利用するアクションはひとつ
        var speaker_action_list = voice_list.concat(sound_list);
        if(checkContentsExist(speaker_action_list)) execAction(user_id, speaker_action_list);

        // tweetアクションは常に実行する
        if(checkContentsExist(tweet_list)) execAction(user_id, tweet_list);

}


function execAction(user_id, action_list) {
        // アクションリストから一つ取り出しコンテンツの内容を取得
        var action = random.select(action_list);
        var type = action.type;
        var contents = action.contents;

        if (type == "voice") {
            voice.exec(user_id, contents, function(err){ if(err) console.log(); });
        } else if (type == "sound") {
            sound.exec(contents, function(err){ if(err) console.log(); });
        } else {
            tweet.exec(user_id, contents, function(err){ if(err) console.log(); });
        }
}

function filterAction(action_type, actions) {
    return actions.filter(function(index){
        return index.type == action_type;
    });
}


// アクションリストが存在しているがタイプごとのコンテンツが存在していない場合のチェック
// 例: { type:voice, contents:[]}
function checkContentsExist(action_list) {
    if(action_list.length > 0) return true;
    else return false;
}
