module.exports = function (router, auth, Home) {

    router.get("/", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Home.getUserHomes(req.user.userId, function (err, home) {
                if(err || !home) {
                    res.error({ message : err && err.toString() });
                } else {
                    res.ok({ "message" : "Fetched User Homes", "home" : home });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.post("/newHome", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            var newHomeObject = {};
            newHomeObject.homeName = req.body.homeName;
            newHomeObject.address = req.body.address;
            newHomeObject.residents = [ req.user.userId ];
            Home.validateHome(newHomeObject, function (err, validatedHomeObject) {
                if(err || !validatedHomeObject) {
                    res.error({ message: err });
                } else {
                    Home.addHome(validatedHomeObject, function (err, home) {
                        if(err || !home) {
                            res.error({ message : err && err.toString() });
                        } else {
                            res.ok({ "message" : "Created New Home", "home" : home });
                        }
                    });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.get("/:homeId", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Home.getHome(req.params.homeId, function (err, home) {
                if(err || !home) {
                    res.error({ message : err && err.toString() });
                } else {
                    res.ok({ "message" : "Found home information", "home" : home });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.delete("/:homeId", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Home.removeHome(req.params.homeId, function (err, home) {
                if(err || !home) {
                    res.error({ message : err && err.toString() });
                } else {
                    res.ok({ "message" : "Home " + req.params.homeId + " Deleted" });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.use(require("./room")(router, auth, Home.Room));

    return router;
};
