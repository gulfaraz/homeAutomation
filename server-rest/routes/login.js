module.exports = function (router, auth, User) {

    router.post("/", function (req, res, next) {
        auth.passport.authenticate("local", function (err, user, info) {
            if(err || !user) {
                res.forbidden({ message : ((err && err.toString()) || info.message) });
            } else {
                User.logIn(req, res, user);
            }
        })(req, res, next);
    });

    router.post("/token", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            User.logIn(req, res, user);
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    return router;
};
