'use strict'
import { assert } from 'chai'
import mongoose from 'mongoose'

// ensure the NODE_ENV is set to 'test'
process.env.NODE_ENV = test

beforeEach(done => {

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
            return claerDB()
        })
    } else {
        return clearDB()
    }
})


afterEach(done => {
    mongoose.disconnect()
    return done()
})

