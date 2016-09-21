module.exports = function () {

    var mongoose = require("mongoose");
    var bcrypt = require("bcrypt-nodejs");
    var Schema = mongoose.Schema;

    var UserSchema = new Schema({
        "userName" : { "type" : String },
        "password" : { "type" : String },
        "mail" : { "type" : String, "lowercase" : true },
        "status" : String,
        "created" : Date,
        "edited" : Date
    });

    UserSchema.pre("save", function (callback) {
        var user = this;
        if (!user.isModified("password")) {
            return callback();
        }
        bcrypt.genSalt(5, function (err, salt) {
            if (err) {
                return callback(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return callback(err);
                }
                user.password = hash;
                callback();
            });
        });
    });

    UserSchema.methods.verifyPassword = function (password, cb) {
        bcrypt.compare(password, this.password, function (err, isMatch) {
            if (err) {
                return cb(err);
            }
            cb(null, isMatch);
        });
    };

    return {
        "User" : mongoose.model("User", UserSchema)
    };

};