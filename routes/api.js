var mongoose = require('mongoose');
var Account = mongoose.model('accounts');
var actions = require('./actions/action');
var logger = require('../utils/logger.js');
// var logger = require('fluent-logger');

// 現在の在室人数を取得
exports.getCurrentNumberOfPeople = function(req, res) {
    Account.countPeople(function(err, count) {
        if(err) new Error("count error");
        res.json(count);
    });
};


// 入退室アクション実行及び状態変更
exports.inout = function(req, res) {
    var user_id = req.params.id;
    Account.load(user_id, function(err, account) {
        if(err) new Error(err);

        // アクション実行
        if(account.in_room) {
            actions.execOutAction(user_id);
            logger.send(user_id + ":out");
        }
        else {
            actions.execInAction(user_id);
            logger.send(user_id + ":in");
        }

        // 状態変更
        account.changeState(function(err) { if(err) new Error('change state error');});
    });

    res.send(200);
};


// 入室
exports.in_room = function(req, res) {
    var user_id = req.params.id;
    Account.load(user_id, function(err, account) {
        if(err) new Error(err);

        // アクション実行
        if(!account.in_room) {
            actions.execInAction(user_id);
            logger.send(user_id + ":in");
            // 状態変更
            account.changeState(function(err) { if(err) new Error('change state error');});
        }
    });

    res.send(200);
};


// 退出
exports.out_room = function(req, res) {
    var user_id = req.params.id;
    Account.load(user_id, function(err, account) {
        if(err) new Error(err);

        // アクション実行
        if(account.in_room) {
            actions.execOutAction(user_id);
            logger.send(user_id + ":out");
            // 状態変更
            account.changeState(function(err) { if(err) new Error('change state error');});
        }
    });

    res.send(200);
};

// 状態取得
exports.getStatus = function(req, res) {
    var user_id = req.params.id;
    Account.load(user_id, function(err, account) {
        if(err) new Error(err);
        res.json(account.in_room);
    });
};


