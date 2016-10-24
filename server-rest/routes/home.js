module.exports = function (router, auth, Home) {

    router.post("/new", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            var newHomeObject = {};
            newHomeObject.name = req.body.name;
            newHomeObject.address = req.body.address;
            newHomeObject.residents = [ req.user.userId ];
            Home.addHome(newHomeObject, function (err, home) {
                if(err || !home) {
                    res.error(err && err.toString());
                } else {
                    res.ok({ "home" : home });
                }
            });
        } else {
            res.forbidden("Invalid Token");
        }
    });

    router.get("/", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Home.getUserHomes(req.user.userId, function (err, home) {
                if(err || !home) {
                    res.error(err && err.toString());
                } else {
                    res.ok({ "home" : home });
                }
            });
        } else {
            res.forbidden("Invalid Token");
        }
    });

    router.get("/:homeId", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Home.getHome(req.params.homeId, function (err, home) {
                if(err || !home) {
                    res.error(err && err.toString());
                } else {
                    res.ok({ "home" : home });
                }
            });
        } else {
            res.forbidden("Invalid Token");
        }
    });

    return router;
};
