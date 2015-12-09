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

/**
 * 入退室管理システムを利用しているユーザアカウント一覧を表示
 * @return {[Account]} 
 */
router.get('/accounts', function(req, res, next) {

    loadAccountListPromise()
        .then(function(accounts){
            res.status(200).json(accounts);            
        })
        .catch(function(err){
            res.status(500).json(err);            
        });
});

/**
 * 入退室状態を取得する
 * @param {String} id
 * @return {String} status: "in" or "out"
 */
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

/**
 * 入退室状態を変更し、設定されているアクションを実行する
 * @param {String} id
 * @return {String} status: "in" or "out"
 */
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

/**
 * アカウントを更新する
 * UserManageServiceから現在研究室に所属しているユーザ一覧を取得
 * アカウントがないユーザの新規アカウントを追加
 * 現在のアカウントのアイコン画像を更新
 * 卒業したユーザのアカウントを削除
 */
router.get('/accounts/update', function(req, res, next) {

    Promise.all([fetchCurretUserPromise(), loadAccountListPromise()])
        .then(updateAccounts) 
        .then(function(result){
            res.status(200).send('ok');            
        })
        .catch(function(err) {
            res.status(500).send(err);
        });
});

/**
 * 現在、研究室にいるユーザの人数を返す
 * @return {int} count
 */
router.get('/accounts/in/count', function(req, res, next) {
    Account.countPeople(function(err, count) {
        if (err) {
            res.status(500).json(err);            
        } else {
            res.status(200).json(count);
        }
    });
});

/**
 * 現在、研究室にいるユーザ一覧を返す
 * @return {[Account]} 
 */
router.get('/accounts/in/list', function(req, res, next) {

    var query = {status: 'in'};
    Account.find(query, function(err, accounts) {
        if (err) {
            res.status(500).json(err);            
        } else {
            res.status(200).json(accounts);
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
                Account.dump(function(err, status) {
                    if(err) {
                        console.log(err);
                    } else {
                        logger.send(status);                        
                    }
                });
                resolve(account);
            }
        });
    });
}

function updateAccounts(results) {
    
    var users = results[0];
    var accounts = results[1];
    
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
                if (err || !account) {
                    reject(err);
                } else {
                    account.update(u.icon_img, function(err){
                        if (err || !account) reject(err);
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
                var actionURLs = [];
                actions.forEach(function(actionURL){
                    actionURLs.push(actionURL);
                });
                resolve(actionURLs);
            } else {
                reject(new Error(err));
            }
        });
    });
}


function execActionPromise(actionURLs) {

    var requests = [];
    
    actionURLs.forEach(function(actionURL){
        var action = new Promise(function(resolve, reject){
            request.get(actionURL, function(err, response, result) {
                if (!err && response.statusCode == 200) {
                    resolve();
                } else {
                    reject(new Error(err));
                }
            });            
        });
        requests.push(action);
    });

    return Promise.all(requests);
}
