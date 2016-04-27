'use strict'
import { assert } from 'chai'
import mongoose from 'mongoose'
import config from '../config'

// ensure the NODE_ENV is set to 'test'
process.env.NODE_ENV = 'test'

before(done => {

    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function(){})
        }
        return done()
    }

    if (mongoose.connection.readyState === 0) {
        mongoose.connect(config.db.test, err => {
            if (err) {
                throw err;
            }
            return clearDB()
        })
    } else {
        return clearDB()
    }
})


after(done => {
    mongoose.disconnect()
    return done()
})


