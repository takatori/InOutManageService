
var config = require("../config");
var mongoose = require('mongoose');
var Account = mongoose.model('accounts');
var user = require('./user');
var actions = require('./actions/action');



function loadUsers() {
    user.loadUsers(function(err, list) {
        if (err) console.log("can't loadUser");
    });
}

// TODO:user_list → account_listに変更
exports.index = function(req, res){
    user.loadUsers(function(error, users) {
        res.render('setting', {
                title: 'Setting',
                user_list: users
        });
    });
};


exports.load = function(req, res) {
    // アカウント情報取得
    // 表示
    user.loadUsers(function(error, users) {
    Account.load(req.params.id, function(err, account){
        if (err) console.log(err);
        res.render('account', {
            title: account.user_id,
            in_actions: account.in_actions,
            out_actions: account.out_actions,
            user_list: users
        });
    });
});
};

exports.testAction = function(req, res) {
    actions.testAction(req.query.type, req.query.contents, req.params.id);
    res.send('200');
};


// modelにfunctionを埋め込んで
// コールバック以外は何もしないようなほうがいい気がする
exports.addAction = function(req, res) {

    var action = { type: req.body.type, contents: req.body.contents};

    Account.load(req.params.id, function(err, account){
        if (!err) {
            if(req.body.in_out === "in") {
                account.in_actions.push(action);
            } else {
                account.out_actions.push(action);
            }

            account.save(function(err){
                if(err)console.log('error save:' + err);
            });
            res.redirect("/setting/" + req.params.id);
        } else {
            console.log('error load: ' + err);
        }
    });
};

exports.deleteAction = function(req, res) {

    Account.load(req.params.id, function(err, account){
        if(!err) {
            if(req.query.in_out === "in") {
                account.in_actions.id(req.query.action_id).remove();
            } else {
                account.out_actions.id(req.query.action_id).remove();
            }
            account.save(function(err){
                if(err)console.log('error save:' + err);
            });
            res.redirect("/setting/" + req.params.id);
        } else {
            console.log('error delete: ' + err);
        }
    });
};


exports.init = function (req, res) {
    user.loadUsers(function (err, users) {
        if (err) {
            console.log("load user error: " + err.stack);
            return err;
        }
        // スコープに注意
        for(var key in users) {
            createAccount(users[key]._id);
        }
    });
    res.send('200');
};


function createAccount(user_id) {
    // ユーザマネージャからidを取得する
    // if(!existAccount) 
    // idがアカウントになければアカウントを作成
    Account.load(user_id, function(err, account) {
        if(!account) {
            var params = {};
            params.user_id = user_id;
            var new_account = new Account(params);
            new_account.save();
        }
    });
}

// function deleteAccount(user_id) {

// }
