/** 
 * @fileoverview 入退室管理システムAPI
 * 
 */
import express from 'express'
const router = express.Router()
import Account from '../models/accounts'
import config from '../config'
import logger from '../utils/logger'

/**
 * 入退室管理システムを利用しているユーザアカウント一覧を表示
 * @return {[Account]} 
 */
router.get('/accounts', function(req, res, next) {

    Account.all()
        .then(function(accounts){
            res.json({accounts: accounts})
        })
        .catch(function(err){
            res.status(500).json(err)
        });
})


/**
 * 入退室状態を変更する
 * @param {String} id
 * @return {String} status: "in" or "out"
 */
router.get('/accounts/:id/inout', function(req, res) {

    var userId = req.params.id;
    
    Account.fetch(userId)
        .then(account => account.changeState())
        .then(() => {
            res.json({message: `Succeeded in changing the ${userId} state`})
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({error: err})
        });
})

/**
 * 現在、研究室にいるユーザの人数を返す
 * @return {int} count
 */
router.get('/accounts/in/count', function(req, res, next) {
    
    Account.countInAccounts()
        .then(count => {
            res.json({count: count})
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

/**
 * 現在、研究室にいるユーザ一覧を返す
 * @return {[Account]} 
 */
router.get('/accounts/in', function(req, res, next) {

    Account.fetchInAccounts()
        .then(accounts => {
            res.json({accounts: accounts})
        })
        .catch(err => {
            res.status(500).json({error: err})
        })    
})


/**
 * アカウントを作成する
 * @param {name} String
 * @param {password} String
 * @param {icon_image_url} String
 */
router.post('/accounts', function(req, res, next) {
    const account = req.body
    Account.create(account)
        .then(account => {
            res.json({message: `Succeeded in create account`, id: account.id })            
        })
        .catch(err => {
            res.status(500).json({error: err})            
        })
})


/**
 * アカウントを更新する
 * @param {id} Int
 * @param {name} String
 * @param {password} String
 * @param {new_password} String
 * @param {icon_image_url} String
 */
router.post('/accounts/:id', function(req, res, next) {
    const id = req.params.id
    const [name, password, new_password, icon_image_url] = [req.body.name, req.body.password, req.body.new_password, req.body.icon_image_url]
    Account.fetch(id)
        .then(account => {
            return account.update(name, password, new_password, icon_image_url)
        })
        .then(function(result){
            res.json({message: `Succeeded in update the account`, id: id })                        
        })
        .catch(function(err) {
            res.status(500).send(err)
        })
})

/**
 * アカウントを削除する
 * @param {id} Int
 * @param {password} String
 */
router.delete('/accounts/:id', function(req, res, next) {
    const id = req.params.id
    const password = req.body.password

    Account.delete(id, password)
        .then(() => {
            res.json({message: `Succeeded in delete the account`})            
        })
        .catch(err => {
            res.status(500).json({error: err})            
        })
})

module.exports = router;




