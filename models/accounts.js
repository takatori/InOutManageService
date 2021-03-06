"use strict";
import mongoose from 'mongoose'
import { Schema }  from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import uuid from 'uuid'
// import autoIncrement from 'mongoose-auto-increment' // Promise.allと併用できない

// アカウント情報を管理するスキーマ
const AccountSchema = new Schema({
    id             : { type: String, required: true, default: uuid.v4},
    name           : { type: String, required: true},
    password       : { type: String, required: true},
    status         : { type: String, default:'out' }, // 在室中か否かを，在室中ならばin, 外出中ならout
    icon_image_url : { type: String }
});

// autoIncrement.initialize(mongoose.connection);
AccountSchema.plugin(uniqueValidator) // https://www.npmjs.com/package/mongoose-unique-validator
// AccountSchema.plugin(autoIncrement.plugin, { model: 'Account', field: 'id', startAt: 1, incrementBy:1}) // https://www.npmjs.com/package/mongoose-auto-increment


// Method 
AccountSchema.methods = {
    // 状態を変更
    changeState: function() {
        if (this.status === 'in') this.status = 'out'
        else this.status = 'in'
        return this.save()
    },

    update: function(name, password, new_password, icon_image_url) {

        if(this.password != password) {
            return Promise.reject('ERROR: password do not match')            
        }
        this.name = name
        this.password = new_password
        this.icon_image_url = icon_image_url
        return this.save()
    }
};

// Statics
AccountSchema.statics = {

    fetch: function(id) {
        return this.findOne({ id : id }).exec() // .exec() -> return Promise
    },
    fetchInAccounts: function() {
        return this.find({ status : 'in' }, { password: 0 }).exec() // .exec() -> return Promise
    },    
    countInAccounts: function() {
        return this.count({ status: 'in'}).exec()
    },
    all: function() {
        return this.find({}, { password: 0 }).sort({ id: 1 }).exec()
    },
    delete: function(id, password) {
        return this.fetch(id)
            .then(account => {
                if (account.password != password) {
                    return Promise.reject('ERROR: password do not match')            
                }
                return this.remove({ id : id }).exec()                            
            })
    }
};


const Account = mongoose.model('accounts', AccountSchema);
export default Account
