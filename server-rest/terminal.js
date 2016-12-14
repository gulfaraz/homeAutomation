module.exports = function (Home, mqttServer) {

    function addTerminal(homeId, roomId, newTerminal, callback) {
        Home.findById(homeId).exec(function (err, home) {
            if(err || !home) {
                callback(err || "Home Not Found");
            } else {
                var newTerminalObject = {
                    terminalName: newTerminal.terminalName,
                    type: newTerminal.terminalType,
                    state: false
                };
                home.rooms.id(roomId).terminals.push(newTerminalObject);
                home.save(callback);
            }
        });
    }

    function removeTerminal(homeId, roomId, terminalId, callback) {
        Home.findById(homeId).exec(function (err, home) {
            if(err || !home) {
                callback(err || "Home Not Found");
            } else {
                var terminal = getTerminal(home, roomId, terminalId);
                if(terminal) {
                    terminal.remove();
                    home.save(callback);
                } else {
                    callback("Terminal Not Found");
                }
            }
        });
    }

    function validateTerminal(terminalObject, callback) {
        if(terminalObject.terminalName && terminalObject.terminalName.length > 0) {
            if(terminalObject.terminalType && terminalObject.terminalType.length > 0) {
                callback(null, terminalObject);
            } else {
                callback("terminalType is missing");
            }
        } else {
            callback("terminalName is missing");
        }
    }

    function setTerminalState(homeId, roomId, terminalId, state, callback) {
        Home.findById(homeId).exec(function (err, home) {
            if(err || !home) {
                callback(err || "Terminal (" + homeId + "/" + roomId + "/" + terminalId + ") is unavailable");
            } else {
                var terminal = getTerminal(home, roomId, terminalId);
                if(terminal) {
                    if(state === "toggle") {
                        terminal.state = !terminal.state;
                    } else if(state === "on" || state === "off") {
                        terminal.state = ((state === "on") ? true : false);
                    } else {
                        callback("Invalid Terminal State");
                    }
                    if(state === "toggle" || state === "on" || state === "off") {
                        mqttServer.controlBroadcast(homeId, roomId, terminalId, (terminal.state ? "on" : "off"));
                    }
                    home.save(callback);
                } else {
                    callback("Terminal Not Found");
                }
            }
        });
    }

    mqttServer.on("message", function (packet, client) {
        var message = (new String(packet.payload)).toString();
        var [topic, homeId, roomId, terminalId] = packet.topic.split("/");
        if(topic === "Pair") {
            linkTerminal(homeId, roomId, terminalId, function (err, terminal) {
                var acknowledgementMessage = "paired";
                if(err) {
                    acknowledgementMessage = "failed";
                }
                mqttServer.acknowledgementBroadcast(homeId, roomId, terminalId, acknowledgementMessage);
            });
        }
    });

    function linkTerminal(homeId, roomId, terminalId, callback) {
        Home.findById(homeId).exec(function (err, home) {
            if(err || !home) {
                callback(err || "Terminal (" + homeId + "/" + roomId + "/" + terminalId + ") is unavailable");
            } else {
                var terminal = getTerminal(home, roomId, terminalId);
                if(terminal) {
                    terminal.linked = true;
                    home.save(callback);
                } else {
                    callback("Terminal Not Found");
                }
            }
        });
    }

    function unlinkTerminal(homeId, roomId, terminalId, callback) {
        Home.findById(homeId).exec(function (err, home) {
            if(err || !home) {
                callback(err || "Terminal (" + homeId + "/" + roomId + "/" + terminalId + ") is unavailable");
            } else {
                var terminal = getTerminal(home, roomId, terminalId);
                if(terminal) {
                    terminal.linked = false;
                    mqttServer.pairBroadcast(homeId, roomId, terminalId, false);
                    home.save(callback);
                } else {
                    callback("Terminal Not Found");
                }
            }
        });
    }

    function getTerminal(home, roomId, terminalId) {
        var terminal = null;
        if(home) {
            var room = home.rooms.id(roomId);
            if(room) {
                terminal = room.terminals.id(terminalId);
            }
        }
        return terminal;
    }

    return {
        addTerminal: addTerminal,
        removeTerminal: removeTerminal,
        validateTerminal: validateTerminal,
        setTerminalState: setTerminalState,
        unlinkTerminal: unlinkTerminal
    };
};
