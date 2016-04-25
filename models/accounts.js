"use strict";
import { Schema }  from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import autoIncrement from 'mongoose-auto-increment'

// アカウント情報を管理するスキーマ
const AccountSchema = new Schema({
    id             : { type: String, required: true, unique:true},
    name           : { type: String, required: true},
    password       : { type: String, required: true},
    status         : { type: String, default:'out' }, // 在室中か否かを，在室中ならばin, 外出中ならout
    icon_image_url : { type: String }
});

AccountSchema.plugin(uniqueValidator) // https://www.npmjs.com/package/mongoose-unique-validator
AccountSchema.plugin(autoIncrement.plugin, { model: 'Account', field: 'id'}) // https://www.npmjs.com/package/mongoose-auto-increment

// Method 
AccountSchema.methods = {
    // 状態を変更
    changeState: function(callback) {
        if (this.status === 'in') this.status = 'out'
        else this.status = 'in'
        this.save(callback)
    },

    update: function(name, password, icon_image_url, callback) {
        this.name = name
        this.password = password
        this.icon_image_url = icon_image_url
        this.save(callback)
    }
};

// Statics
AccountSchema.statics = {

    fetch: function(id, callback) {
        this.findOne({ id : id })
            .exec(callback)
    },
    list: function(callback) {
        this.find()
            .sort({ id: 1 })
            .exec(callback)
    },
    countPeople: function(callback) {
        this.count({ status: 'in'})
            .exec(callback)
    },
    dump: function(callback) {
        this.find({}, {_id:0, id:1, status:1})
            .sort({ id: 1})
            .exec(callback)
    },
    delete: function(id, callback) {
        this.remove({ id : id })
            .exec(callback)
    }
};


const Account = mongoose.model('accounts', AccountSchema);
export default Account
