module.exports = function (User, configuration) {

    var passport = require("passport");
    var BearerStrategy = require("passport-http-bearer").Strategy;
    var LocalStrategy = require("passport-local").Strategy;
    var jwt = require("jsonwebtoken");

    jwt.secret = configuration.secret;

    jwt.generateToken = function (decoded, expires) {
        return jwt.sign(decoded, jwt.secret, { "expiresIn" : ((expires) ? expires : (configuration.sessionTimeout)) });
    };

    jwt.verifyToken = function (token, callback) {
        jwt.verify(token, jwt.secret, function (err, decoded) {
            if(err) {
                callback(false, err);
            } else {
                User.findById(decoded.userId)
                    .exec(function (err, user) {
                        if(err) {
                            callback(false, err);
                        } else {
                            if(!user) {
                                callback(false, "User not found");
                            } else {
                                callback(true, authReturn(user));
                            }
                        }
                    });
            }
        });
    };

    passport.serializeUser(function (user, callback) {
        callback(null, user.userId);
    });

    passport.deserializeUser(function (id, callback) {
        User.findById(id, function (err, user) {
            callback(err, user);
        });
    });

    var authReturn = function(user, token) {
        user = {
            "userName" : user.userName || user._id,
            "userId" : user._id,
            "role" : user.role,
            "token" : jwt.generateToken({ userId : user._id.toString() })
        };
        return user;
    };

    passport.use("local", new LocalStrategy({
        "usernameField" : "userName",
        "passwordField" : "password",
        "passReqToCallback" : true
    }, function (req, userName, password, callback) {
        process.nextTick(function () {
                var query = { "userName" : userName };
                User.find(query)
                    .limit(1)
                    .exec(function (err, user) {
                        if(err) {
                            callback(err.toString());
                        } else {
                            user = user[0];
                            if(!user) {
                                callback("User Not Found");
                            } else {
                                user.verifyPassword(password, function (err, isMatch) {
                                    if(err) {
                                        callback(err.toString());
                                    } else {
                                        if(!isMatch) {
                                            callback("Invalid Passcode");
                                        } else {
                                            callback(null, authReturn(user));
                                        }
                                    }
                                });
                            }
                        }
                    });
        });
    }));

    passport.use(new BearerStrategy(function (token, callback) {
            process.nextTick(function () {
                jwt.verify(token, jwt.secret, function (err, decoded) {
                    if(err) {
                        callback(err);
                    } else {
                        User.find({ "_id" : decoded.userId })
                            .limit(1)
                            .exec(function (err, user) {
                                if(user) {
                                    user = user[0];
                                    if(err) {
                                        callback(err);
                                    } else {
                                        if(!user) {
                                            callback(null, false);
                                        } else {
                                            if(user.status === "active") {
                                                var permissions = { "scope" : "read" };
                                                if(user.role === "member") {
                                                    permissions.scope = "edit";
                                                } else if(user.role === "moderator") {
                                                    permissions.scope = "manage";
                                                } else if(user.role === "super") {
                                                    permissions.scope = "*";
                                                }
                                                callback(null, authReturn(user), permissions);
                                            } else {
                                                callback(null, false);
                                            }
                                        }
                                    }
                                } else {
                                    callback(null, false);
                                }
                            });
                    }
                });
            });
        }));

    return {
        "passport" : passport
    }

};
