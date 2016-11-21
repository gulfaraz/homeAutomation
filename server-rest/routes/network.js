module.exports = function (router, auth, Network) {

    router.get("/", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Network.findNetwork(req.user._id, function (error, networks) {
                if(error) {
                    res.error({ message : error && error.toString() });
                } else {
                    var responseObject = { "message" : "Found Networks", "networks" : networks };
                    if(networks.length < 1) {
                        responseObject.message = "No networks found";
                    }
                    res.ok(responseObject);
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.post("/link", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            var networkObject = {
                networkName : req.body.networkName,
                password : req.body.password,
                owner : req.user._id
            };
            Network.linkNetwork(networkObject, function (error, network) {
                if(error) {
                    res.error({ message : error && error.toString() });
                } else {
                    res.ok({ "message" : "Network Linked", "network" : network });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.delete("/:networkId", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Network.unlinkNetwork(req.params.networkId, function (error, network) {
                if(error) {
                    res.error({ message : error && error.toString() });
                } else {
                    res.ok({ "message" : "Network Unlinked", "network" : network });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    return router;
};
