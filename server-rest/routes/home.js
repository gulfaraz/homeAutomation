module.exports = function (router, auth, Home) {

    router.post("/new", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            var newHomeObject = {};
            newHomeObject.name = req.body.name;
            newHomeObject.address = req.body.address;
            newHomeObject.residents = [ req.user ];
            Home.addHome(newHomeObject, function (err, home) {
                if(err || !home) {
                    res.error((err && err.toString()) || info.message);
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
