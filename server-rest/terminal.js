module.exports = function (Home, mqttServer) {

    var syncDisconnectTime = 1000 * 3,
        linkDisconnectTime = 1000 * 60 * 30;

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
                    mqttServer.pairBroadcast(homeId, roomId, terminalId, "false");
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
                    terminal.synced = ((terminal.lastControlTime - terminal.lastStateTime) < syncDisconnectTime);
                    terminal.linked = ((terminal.lastControlTime - terminal.lastStateTime) < linkDisconnectTime);
                    terminal.lastControlTime = (new Date());
                    home.save(callback);
                } else {
                    callback("Terminal Not Found");
                }
            }
        });
    }

    mqttServer.on("published", function (packet, client) {
        var message = (new String(packet.payload)).toString();
        var [topic, homeId, roomId, terminalId] = packet.topic.split("/");
        if(topic === "Pair") {
            if(message === "link") {
                linkTerminal(homeId, roomId, terminalId, function (err, terminal) {
                    var acknowledgementMessage = "paired";
                    if(err) {
                        acknowledgementMessage = "failed";
                    }
                    mqttServer.acknowledgementBroadcast(homeId, roomId, terminalId, acknowledgementMessage);
                });
            }
        } else if(topic === "State") {
            updateTerminal(homeId, roomId, terminalId, function (terminal) {
                if(message === "on" || message === "off") {
                    terminal.state = (message === "on");
                    terminal.lastStateTime = (new Date());
                    terminal.synced = ((terminal.lastStateTime - terminal.lastControlTime) < syncDisconnectTime);
                }
            }, function () {});
        }
    });

    function linkTerminal(homeId, roomId, terminalId, callback) {
        updateTerminal(homeId, roomId, terminalId, function (terminal) {
            mqttServer.controlBroadcast(homeId, roomId, terminalId, "on");
            terminal.linked = true;
        }, callback);
    }

    function unlinkTerminal(homeId, roomId, terminalId, callback) {
        updateTerminal(homeId, roomId, terminalId, function (terminal) {
            terminal.linked = false;
            mqttServer.pairBroadcast(homeId, roomId, terminalId, "false");
        }, callback);
    }

    function refreshTerminal(homeId, roomId, terminalId, callback) {
        updateTerminal(homeId, roomId, terminalId, function (terminal) {
            mqttServer.acknowledgementBroadcast(homeId, roomId, terminalId, "state");
            terminal.synced = ((terminal.lastControlTime - terminal.lastStateTime) < syncDisconnectTime);
            terminal.linked = ((terminal.lastControlTime - terminal.lastStateTime) < linkDisconnectTime);
        }, callback);
    }

    function updateTerminal(homeId, roomId, terminalId, execute, callback) {
        Home.findById(homeId).exec(function (err, home) {
            if(err || !home) {
                callback(err || "Terminal (" + homeId + "/" + roomId + "/" + terminalId + ") is unavailable");
            } else {
                var terminal = getTerminal(home, roomId, terminalId);
                if(terminal) {
                    execute(terminal);
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
        unlinkTerminal: unlinkTerminal,
        refreshTerminal: refreshTerminal
    };
};
