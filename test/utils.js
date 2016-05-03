'use strict'

import mongoose from 'mongoose'
import config from '../config'
import Account from '../models/accounts'



// ensure the NODE_ENV is set to 'test'
process.env.NODE_ENV = 'test'

    
const accounts = [
    {
        name: 'takatori',
        password: 'satoshi',
        icon_image_url: 'https://placeimg.com/640/480/any'
    },
    {
        name: 'foo',
        password: 'bar',
        icon_image_url: 'https://placeimg.com/640/480/any'
    },
    {
        name: 'dummy',
        password: 'data',
        icon_image_url: 'https://placeimg.com/640/480/any'
    }                
]

function clearDB() {
    return new Promise(function(resolve, reject){
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function(err){
                if(err) reject(err)
            })
        }
        resolve()
    })
}

function promiseAccount(account) {
    return Account.create(account)
}

function InsertDummyAccounts(accounts) {
    const promises = accounts.map(account => { return promiseAccount(account)})
    return Promise.all(promises)
}

before(() => {
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.db.test, err => {
            if (err) throw err
            return clearDB()
        })
    } else {
        return clearDB()
    }
})


beforeEach(() => {
    return clearDB()
        .then(InsertDummyAccounts(accounts))
})


afterEach(() => {
    return clearDB()
})


after(done => {
    mongoose.disconnect()
    return done()
})


