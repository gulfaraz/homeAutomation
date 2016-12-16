module.exports = function (Home) {

    function getUnlinkedTerminals(userId, callback) {
        Home.find({ residents: userId }).lean().exec(function (err, homes) {
            if(err) {
                callback(err);
            } else {
                var unlinkedTerminals = [];
                for(var homeIndex in homes) {
                    var rooms = homes[homeIndex].rooms;
                    for(var roomIndex in rooms) {
                        var sortedTerminals = rooms[roomIndex].terminals.sort(function (a, b) {
                            var timeOrder = (a.created - b.created);
                            return (a.linked ? (b.linked ? timeOrder : 1) : (b.linked ? -1 : timeOrder));
                        });
                        for(var terminalIndex in sortedTerminals) {
                            var terminal = sortedTerminals[terminalIndex];
                            terminal.terminalId = terminal._id;
                            terminal.roomId = rooms[roomIndex]._id;
                            terminal.homeId = homes[homeIndex]._id;
                            unlinkedTerminals.push(terminal);
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
