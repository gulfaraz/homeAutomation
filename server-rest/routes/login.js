module.exports = function (router, auth) {

    router.post("/", function (req, res, next) {
        auth.passport.authenticate("local", function (err, user, info) {
            if(err || !user) {
                res
                    .status(401)
                    .json({
                        "success" : false,
                        "message" : ((err && err.toString()) || info.message)
                    });
            } else {
                req.logIn(user, function (err) {
                    if(err) {
                        res
                            .status(401)
                            .json({
                                "success" : false,
                                "message" : err.toString()
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                "success" : true,
                                "message" : "User Authenticated",
                                "token" : req.user.token,
                                "userName" : req.user.userName,
                                "userId" : req.user.userId
                            });
                    }
                });
            }
        })(req, res, next);
    });

    router.post("/token", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            req.logIn(req.user, function (err) {
                if(err) {s
                    res
                        .status(401)
                        .json({
                            "success" : false,
                            "message" : err.toString()
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            "success": true,
                            "message": "User Authenticated",
                            "userName" : req.user.userName,
                            "userId" : req.user.userId,
                            "token" : req.user.token
                        });
                }
            });
        } else {
            res.json({
                "success": false,
                "message": "Invalid Token"
            });
        }
    });

    return router;
};
