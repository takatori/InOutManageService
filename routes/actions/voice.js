var config = require("../../config");
var http = require("../../utils/http.js");
var user = require('../user');

exports.exec = function(user_id, voice_str, callback) {

    // ユーザ情報の取得
    user.loadById(user_id, function(err, user_data){
        // リクエスト生成
        var voice_url = createUrl(user_data, voice_str, function(err){
            if(err) {
                console.log("voice createUrl error: ", err.stack);
                return callback(err);
            }
        });
        // リクエスト実行
        http.get(voice_url, function(err) {
            if(err) { console.log("voice error:" + err.stack);}
        });
    });
};

// voiceアクションのリクエストを投げる先のURLを生成
function createUrl(user_data, voice_str, callback) {

    if(!voice_str) {
        console.log("voice_str is null");
        return callback(err);
    }
    
    var str,operator,contents;
    // ":"で分割し、発話者と発話内容を分ける
    // 例: misaki:こんにちは
    try{
        str = voice_str.split(":"); //TODO:エラー処理
        operator = str[0]; // misaki か ai
        contents = str[1];
    } catch(e) {
        console.log(e);
        return callback(e);
    }

    // [user]をユーザ名に置換
    // 例 misaki:[user]さん、こんにちは　→　misaki:とりさん、こんにちは
    contents = replaceAll(contents, "[user]", user_data.screen_name);

    // UTF-8エンコード
    var params =  encodeURIComponent(contents);

    if (operator === "misaki") {
        return config.actions.voice.misaki.url + params;
    }
    else if (operator ==="ai") {
        return config.actions.voice.ai.url + params;
    }
}

// すべての文字列 org を dest に置き換える
function replaceAll(expression, org, dest) {
    try {
        return expression.split(org).join(dest);
    } catch(e) {
        console.log(e);
    }
}