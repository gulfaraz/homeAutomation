module.exports = function (Home, mqttServer) {

    function addRoom(homeId, newRoom, callback) {
        Home.findById(homeId).exec(function (err, home) {
            var newRoomObject = {
                roomName: newRoom.roomName,
                terminals: []
            };
            home.rooms.push(newRoomObject);
            home.save(callback);
        });
    };

    function removeRoom(homeId, roomId, callback) {
        Home.findById(homeId).exec(function (err, home) {
            home.rooms.id(roomId).remove();
            home.save(callback);
        });
    };

    function validateRoom(roomObject, callback) {
        if(roomObject.roomName && roomObject.roomName.length > 0) {
            callback(null, roomObject);
        } else {
            callback("roomName is missing");
        }
    };

    return {
        addRoom: addRoom,
        removeRoom: removeRoom,
        validateRoom: validateRoom,
        Terminal: require("./terminal")(Home, mqttServer)
    };
};
