
var mongoose = require('mongoose');
var Account = mongoose.model('accounts');
var actions = require('./actions/action');
var API = require('./api');
// ログ関係
// var logger = require('../logger');

// アプリのメインページを表示
exports.index = function(req, res){
    Account.list(function(err, users) {
        if(err) new Error('account load error');
        res.render('index', {
                title: 'InOutManageService',
                user_list: users
        });
    });
};

exports.inout = function(req, res) {
    // var user_id = req.params.id;
    // logger.logging(user_id + ":in");
    // Account.load(user_id, function(err, account) {
    //     if(err) new Error(err);
    //     console.log(account.in_room);
    //     if(account.in_room) actions.execOutAction(user_id);
    //     else actions.execInAction(user_id);
    //     // 状態変更
    //     account.changeState(function(err) { if(err) new Error('change state error');});
    // });
    API.inout(req, res);
};

