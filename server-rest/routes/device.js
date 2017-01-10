module.exports = function (router, auth, Device) {

    router.post("/terminals", function (req, res, next) {
        auth.passport.authenticate("local", function (err, user, info) {
            if(err || !user) {
                res.forbidden({ message : ((err && err.toString()) || info.message) });
            } else {
                Device.getTerminals(user.userId, function (err, terminals) {
                    if(err) {
                        res.error({ message : err && err.toString() });
                    } else {
                        res.ok({ "message" : "Fetched All Terminals", "terminals" : terminals });
                    }
                });
            }
        })(req, res, next);
    });

    router.get("/firmware", function (req, res, next) {
        Device.getFirmware(res.ok);
    });

    return router;
};
