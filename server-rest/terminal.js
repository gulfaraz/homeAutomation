module.exports = function (Home) {

    function addTerminal(homeId, roomId, newTerminal, callback) {
        Home.findById(homeId).exec(function (err, home) {
            if(err || !home) {
                callback(err || "ADD TERMINAL Home Not Found");
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
    };

    function removeTerminal(homeId, roomId, terminalId, callback) {
        Home.findById(homeId).exec(function (err, home) {
            if(err || !home) {
                callback(err || "REMOVE TERMINAL Home Not Found");
            } else {
                home.rooms.id(roomId).terminals.id(terminalId).remove();
                home.save(callback);
            }
        });
    };

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
    };

    function setTerminalState(homeId, roomId, terminalId, state, callback) {
        Home.findById(homeId).exec(function (err, home) {
            if(err || !home) {
                callback(err || "Terminal (" + homeId + "/" + roomId + "/" + terminalId + ") is unavailable");
            } else {
                var terminal = home.rooms.id(roomId).terminals.id(terminalId);
                if(state === "toggle") {
                    terminal.state = !terminal.state;
                } else if(state === "on" || state === "off") {
                    terminal.state = ((state === "on") ? true : false);
                } else {
                    callback("Invalid Terminal State");
                }
                home.save(callback);
            }
        });
    };

    return {
        addTerminal: addTerminal,
        removeTerminal: removeTerminal,
        validateTerminal: validateTerminal,
        setTerminalState: setTerminalState
    };

};