var express = require('express');
var router = express.Router();
var request = require('request');
var Account = require('../models/accounts').Account;
var config = require('../config');

// GET
/* List */
router.get('/accounts', function(req, res, next) {
    Account.list(function(err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(data);
        }
    });
});


// 在室状態変更
router.get('/accounts/:id/inout', function(req, res) {

    var userId = req.params.id;
    
    Account.load(userId, function(err, account) {
        if (err) {
            res.status(500).json(err);
        } else {
            console.log(account);
            account.changeState(function(err) {
                if (err) res.status(500).json(err);
                else     res.status(200).json(account.status);
            });
        }
    });    
});

// アクション実行
function execAction() {

    var url;
    
    if (process.env.NODE_ENV === 'production') url = config.users.db.production;
    else url = config.users.db.development;

    // currentユーザ取得
    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body.name);
        } else {
            console.log('error: '+ response.statusCode);
        }
    });
}


// TODO
// 新年度の際、現在のメンバーでなければアカウント削除
router.get('/users/update', function(req, res, next) {

    var url = '';
    
    if (process.env.NODE_ENV === 'production'){
        url = config.users.db.production;  
    } else {
        url = config.users.db.development;        
    }
    url += config.users.apis.current;

    request.get(url, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            
            var users = JSON.parse(body);
            // 現在のアカウントと比較
            // 無くなってたらフラグ変更、新しくできてたら追加
            Account.list(function(err, accounts) {
                if (err) {
                    res.status(500).json('error: load accounts');
                } else {
                    // 追加
                    var newUser = users.filter(function(user) {
                        return (accounts.indexOf(user) < 0);
                    });

                    newUser.forEach(function(u){
                        Account.create(u, function(err){
                            if (err) console.log(err);
                        });
                    });


                    // 削除
                    var graduatedUser = accounts.filter(function(account) {
                        return (users.indexOf(account) < 0);
                    });
                    res.status(200).json('ok');
                }
            });

            // 削除

            // Account.delete(id, function(){
                
            // });
            
        } else {
            console.log(err);
        }
    });
});


// 現在のユーザをUserManageServiceから取得
function fetchCurretUser(url) {
    var users = [];
    // currentユーザ取得
    request.get(url, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            users = JSON.parse(body);
        } else {
            console.log(err);
        }
    });
    return users;
}

// 現在の在室人数を取得
router.get('/users/count', function(req, res, next) {
    Account.countPeople(function(err, count) {
        if (err) {
            res.status(500).json();            
        } else {
            res.status(200).json(count);
        }
    });
});

module.exports = router;


