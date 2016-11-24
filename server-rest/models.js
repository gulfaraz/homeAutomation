module.exports = function () {

    var mongoose = require("mongoose");
    var bcrypt = require("bcrypt-nodejs");
    var Schema = mongoose.Schema;

    var UserSchema = new Schema({
        "userName" : { "type" : String, "required" : true },
        "password" : { "type" : String, "required" : true },
        "mail" : { "type" : String, "lowercase" : true, "required" : true },
        "status" : String,
        "created" : { "type" : Date, "default" : Date.now },
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

    var TerminalSchema = new Schema({
        "terminalName" : { "type" : String, "required" : true },
        "type" : { "type" : String },
        "state" : { "type" : Boolean, "default" : true },
        "linked" : { "type" : Boolean, "default" : false },
        "created" : { "type" : Date, "default" : Date.now },
        "edited" : { "type" : Date, "default" : Date.now }
    });

    var RoomSchema = new Schema({
        "roomName" : { "type" : String, "required" : true },
        "terminals" : [ TerminalSchema ],
        "status" : { "type" : Boolean, "default" : true },
        "created" : { "type" : Date, "default" : Date.now },
        "edited" : { "type" : Date, "default" : Date.now }
    });

    var HomeSchema = new Schema({
        "homeName" : { "type" : String, "required" : true },
        "residents" : [ { "type" : String } ],
        "address" : { "type" : String },
        "rooms" : [ RoomSchema ],
        "status" : { "type" : Boolean, "default" : true },
        "created" : { "type" : Date, "default" : Date.now },
        "edited" : { "type" : Date, "default" : Date.now }
    });

    return {
        "User" : mongoose.model("User", UserSchema),
        "Home" : mongoose.model("Home", HomeSchema)
    };

};
