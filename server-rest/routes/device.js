module.exports = function (router, auth, Device) {

    router.post("/free", function (req, res, next) {
        auth.passport.authenticate("local", function (err, user, info) {
            if(err || !user) {
                res.forbidden({ message : ((err && err.toString()) || info.message) });
            } else {
                Device.getUnlinkedTerminals(user.userId, function (err, terminals) {
                    if(err) {
                        res.error({ message : err && err.toString() });
                    } else {
                        res.ok({ "message" : "Fetched Free Terminals", "terminals" : terminals });
                    }
                });
            }
        })(req, res, next);
    });

    return router;
};
