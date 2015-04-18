var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var config = require('../config');
// アカウント情報を管理するスキーマ
var AccountSchema = new Schema({
    id       : { type: String, required: true, unique:true},     // userIdはUserManageServiceで定義されているIDと同じものを利用
    status   : { type: String, default:'out' }, // 在室中か否かを，在室中ならばin, 外出中ならout
    icon_img : { type: String }
});

// Method 
AccountSchema.methods = {
    // 状態を変更
    changeState: function(callback) {
        if(this.status === 'in') this.status = 'out';
        else this.status = 'in';
        this.save(callback);
    },

    update: function(icon_img, callback) {
        this.icon_img = icon_img;
        this.save(callback);
    }
};

// Statics
AccountSchema.statics = {

    load: function(id, callback) {
        this.findOne({ id : id })
            .exec(callback);
    },
    list: function(callback) {
        this.find()
            .sort({ id: 1 })
            .exec(callback);
    },
    countPeople: function(callback) {
        this.count({ status: 'in'})
            .exec(callback);
    },
    delete: function(id, callback) {
        this.remove({ id : id })
            .exec(callback);
    }
};

module.exports.Account = mongoose.model('accounts', AccountSchema);
