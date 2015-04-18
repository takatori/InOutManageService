/** 
 * @fileoverview 入退室管理システムAPI
 * 
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var Account = require('../models/accounts').Account;
var config = require('../config');
var logger = require('../utils/logger.js');

// GET
/* List */
router.get('/accounts', function(req, res, next) {

    loadAccountListPromise()
        .then(function(accounts){
            res.status(200).json(accounts);            
        })
        .catch(function(err){
            res.status(500).json(err);            
        });
});

// 状態確認
router.get('/accounts/:id/status', function(req, res){

    var userId = req.params.id;
    Account.load(userId, function(err, account) {
        if (err) {
            res.status(500).json(err);            
        } else {
            res.status(200).json(account.status);            
        }
    });
    
});

// 在室状態変更
router.get('/accounts/:id/inout', function(req, res) {

    var userId = req.params.id;
    
    loadAccountPromise(userId)
        .then(changeStatePromise)
        .then(function (account) {
            return new Promise(function(resolve, reject){
                res.status(200).json(account.status);                            
                resolve(account);
            });                
        })
        .then(fetchActionURLPromise)
        .then(execActionPromise)    
        .catch(function(err) {
            console.log(err);
            res.status(500).send(err);
        });
});

// 新年度の際、現在のメンバーでなければアカウント削除
router.get('/accounts/update', function(req, res, next) {

    Promise.all([fetchCurretUserPromise(), loadAccountListPromise()])
        .then(classifyUser) // 名前変更する
        .then(function(result){
            res.status(200).send('ok');            
        })
        .catch(function(err) {
            res.status(500).send(err);
        });
});




// 現在の在室人数を取得
router.get('/accounts/count', function(req, res, next) {
    Account.countPeople(function(err, count) {
        if (err) {
            res.status(500).json();            
        } else {
            res.status(200).json(count);
        }
    });
});

module.exports = router;

function fetchCurretUserPromise() {

    var url = resolveUserManageServiceURL() + config.users.apis.current;
    
    return new Promise(function (resolve, reject) {
        request.get(url, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                users = JSON.parse(body);
                resolve(users);
            } else {
                reject(err);
            }
        });        
    });
}

function loadAccountPromise(userId) {
    return new Promise(function (resolve, reject){
        Account.load(userId, function(err, account) {
            if (err) {
                reject(new Error(err));
            } else {
                resolve(account);
            }
        });
    });
}

function loadAccountListPromise() {
    return new Promise(function (resolve, reject){
        Account.list(function(err, accounts) {
            if (err || !accounts) {
                reject(new Error(err));
            } else {
                resolve(accounts);
            }
        });
    });
}

function getStatePromise(userId) {
    return new Promise(function (resolve, reject) {
        Account.load(userId, function(err, account) {
            if (err || !account) {
                reject(new Error(err));
            } else {
                resolve(account.status);
            }
        });        
    });
}


function changeStatePromise(account) {
    return new Promise(function (resolve, reject) {
        account.changeState(function(err){
            if (err) {
                reject(new Error(err));
            } else {
                logger.send(account.id, account.status);
                resolve(account);
            }
        });
    });
}

function classifyUser(results) {

    var users = result[0];
    var accounts = result[1];

    // 新しいメンバー
    var newUsers = users.filter(function(user) {
        return (accounts.indexOf(user) < 0);
    });
    
    // 卒業したメンバー
    var graduatedUsers = accounts.filter(function(account) {
        return (users.indexOf(account) < 0);
    });

    // 現役のメンバー
    var currentUsers = users.filter(function(user) {
        return (newUsers.indexOf(user) < 0 || graduatedUsers.indexOf(user) < 0);        
    });
    
    return Promise.all([
        createNewAccountPromise(newUsers),
        updateAccountPromise(currentUsers),
        deleteAccountPromise(graduatedUsers)
    ]);
}

function createNewAccountPromise(newUsers) {
    
    return new Promise(function(resolve, reject){
        newUsers.forEach(function(u){
            Account.create(u, function(err){
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

function updateAccountPromise(currentUsers) {

    return new Promise(function(resolve, reject){
        currentUsers.forEach(function(u){
            Account.load(u.id, function(err, account){
                if (err) {
                    reject(err);
                } else {
                    account.udpate(u.icon_img, function(err){
                        if (err) reject(err);
                        else resolve();                        
                    });
                }
            });
        });
    });
}


function deleteAccountPromise(graduatedUsers) {
     
    return new Promise(function(resolve, reject){
        graduatedUsers.forEach(function(u){
            Account.delete(u.id, function(err){
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}



function resolveUserManageServiceURL() {
    if (process.env.NODE_ENV === 'production') return config.users.url.production;
    else return config.users.url.development;
}



function fetchActionURLPromise(account) {

    var url = resolveUserManageServiceURL() + '/apis/users/' + account.id + '/configs/search';
    var query = {form: { tags: ['入退室', account.status] } };
    
    return new Promise(function (resolve, reject) {
        request.post(url, query, function (err, response, body) {
            if (!err && response.statusCode == 200) {
                var actions = JSON.parse(body);
                actions.forEach(function(actionURL){
                    resolve(actionURL);                    
                });
            } else {
                reject(new Error(err));
            }
        });
    });
}


function execActionPromise(actionURL) {
    
    return new Promise(function (resolve, reject) {
        request.get(actionURL, function(err, response, result) {
            if (!err && response.statusCode == 200) {
                resolve();
            } else {
                reject(new Error(err));
            }
        });
    });
}


