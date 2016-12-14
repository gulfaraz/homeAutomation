module.exports = function (router, auth, Terminal) {

    router.put("/:homeId/room/:roomId/terminal/newTerminal", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            var newTerminalObject = {
                "terminalName" : req.body.terminalName,
                "terminalType" : req.body.terminalType
            };
            Terminal.validateTerminal(newTerminalObject, function (err, validatedTerminalObject) {
                if(err || !validatedTerminalObject) {
                    res.error({ message: err });
                } else {
                    Terminal.addTerminal(req.params.homeId, req.params.roomId, validatedTerminalObject, function (err, home) {
                        if(err || !home) {
                            res.error({ message : err && err.toString() });
                        } else {
                            res.ok({ "message" : "Created New Terminal", "home" : home });
                        }
                    });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.get("/:homeId/room/:roomId/terminal/:terminalId/unlink", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Terminal.unlinkTerminal(req.params.homeId, req.params.roomId, req.params.terminalId, function (err, home) {
                if(err || !home) {
                    res.error({ message : err && err.toString() });
                } else {
                    res.ok({ "message" : "Unlinked Terminal Device", "home" : home });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.get("/:homeId/room/:roomId/terminal/:terminalId/refresh", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Terminal.refreshTerminal(req.params.homeId, req.params.roomId, req.params.terminalId, function (err, home) {
                if(err || !home) {
                    res.error({ message : err && err.toString() });
                } else {
                    res.ok({ "message" : "Refreshed Terminal Information", "home" : home });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.get("/:homeId/room/:roomId/terminal/:terminalId/:state", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Terminal.setTerminalState(req.params.homeId, req.params.roomId, req.params.terminalId, req.params.state, function (err, home) {
                if(err || !home) {
                    res.error({ message : err && err.toString() });
                } else {
                    res.ok({ "message" : "Updated Terminal State", "home" : home });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.delete("/:homeId/room/:roomId/terminal/:terminalId", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Terminal.removeTerminal(req.params.homeId, req.params.roomId, req.params.terminalId, function (err, home) {
                if(err || !home) {
                    res.error({ message : err && err.toString() });
                } else {
                    res.ok({ message: "Terminal " + req.params.terminalId + " Deleted", home: home });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    return router;
};
