
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// スキーマ定義

// 入退時に実行するアクションを定義するスキーマ
// embedded document
var Actions = new Schema({
    // actionのタイプ[voice, sound, tweet]のいずれか
    type: { type: String, enum:['voice', 'sound', 'tweet'], required: true},
    // actionの内容
    contents: { type: String, default: ''}
});

// アカウント情報を管理するスキーマ
var AccountSchema = new Schema({
    // user_idはUserManageServiceで定義されているIDと同じものを利用
    user_id : { type: String, default: 'default', required: true, unique:true},
    // user_name : {type: String, required: true},
    // 在室中か否かを，在室中ならばtrue
    in_room : { type: Boolean, default: false},
    // 入退室時のアクション
    in_actions: [Actions],
    out_actions: [Actions]
});

// Virtuals
// Validations
// pre-save hook
// pre-remove hook



// Method 
AccountSchema.methods = {
    // addAction: function (in_out, action, callback) {
    //     // TODO:validate実行 
    //     if (in_out === "in") {
    //         this.in_actions.push(action);
    //     } else {
    //         this.out_actions.push(action);
    //     }
    //     this.save(callback);
    // }
    changeState: function(callback) {
        if(this.in_room) this.in_room = false;
        else this.in_room = true;
        this.save(callback);
    }
};

// Statics
AccountSchema.statics = {

    load: function(id, callback) {
        this.findOne({ user_id : id })
            .exec(callback);
    },

    list: function(callback) {
        this.find()
            .sort({ user_id:1 })
            .exec(callback);
    },

    countPeople: function(callback) {
        this.count({ in_room: true})
            .exec(callback);
    }

    // これは出来ない..なぜ？
    // changeState: function(id, callback) {
    //     this.findOne({user_id : id}, function(err, account) {
    //         if(err) {
    //             new Error("account load error");
    //             return err;
    //         }
    //         console.log(account);
    //         if(account.in_room) account.in_room = false;
    //         else account.in_room = true;
    //         account.save();
    //     });
    // }
};

mongoose.model('accounts', AccountSchema);