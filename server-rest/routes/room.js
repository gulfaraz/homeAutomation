module.exports = function (router, auth, Room) {

    router.put("/:homeId/room/newRoom", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            var newRoomObject = {
                "roomName" : req.body.roomName
            };
            Room.validateRoom(newRoomObject, function (err, validatedRoomObject) {
                if(err || !validatedRoomObject) {
                    res.error({ message: err });
                } else {
                    Room.addRoom(req.params.homeId, validatedRoomObject, function (err, home) {
                        if(err || !home) {
                            res.error({ message : err && err.toString() });
                        } else {
                            res.ok({ "message" : "Created New Room", "home" : home });
                        }
                    });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.delete("/:homeId/room/:roomId", auth.passport.authenticate("bearer", { "session" : false }), function (req, res) {
        if(req.user) {
            Room.removeRoom(req.params.homeId, req.params.roomId, function (err, home) {
                if(err || !home) {
                    res.error({ message : err && err.toString() });
                } else {
                    res.ok({ message: "Room " + req.params.roomId + " Deleted", home: home });
                }
            });
        } else {
            res.forbidden({ message : "Invalid Token" });
        }
    });

    router.use(require("./terminal")(router, auth, Room.Terminal));

    return router;
};
