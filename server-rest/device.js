module.exports = function (Home) {

    function getUnlinkedTerminals(userId, callback) {
        Home.find({ residents: userId }).exec(function (err, homes) {
            if(err) {
                callback(err);
            } else {
                var unlinkedTerminals = [];
                for(var homeIndex in homes) {
                    var rooms = homes[homeIndex].rooms;
                    for(var roomIndex in rooms) {
                        if(isFinite(roomIndex)) {
                            var filteredTerminals = rooms[roomIndex].terminals.filter(function (terminal) {
                                return !terminal.linked;
                            });
                            for(var terminalIndex in filteredTerminals) {
                                var terminal = filteredTerminals[terminalIndex];
                                terminal = terminal.toObject();
                                terminal.terminalId = terminal._id;
                                terminal.roomId = rooms[roomIndex]._id;
                                terminal.homeId = homes[homeIndex]._id;
                                unlinkedTerminals.push(terminal);
                            }
                        }
                    }
                }
                callback(null, unlinkedTerminals);
            }
        });
    }

    return {
        getUnlinkedTerminals: getUnlinkedTerminals
    }
};
