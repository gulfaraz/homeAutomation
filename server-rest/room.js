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
    }

    function removeRoom(homeId, roomId, callback) {
        Home.findById(homeId).exec(function (err, home) {
            var room = getRoom(home, roomId);
            if(room) {
                room.remove();
                home.save(callback);
            } else {
                callback("Room Not Found");
            }
        });
    }

    function validateRoom(roomObject, callback) {
        if(roomObject.roomName && roomObject.roomName.length > 0) {
            callback(null, roomObject);
        } else {
            callback("roomName is missing");
        }
    }

    function getRoom(home, roomId) {
        var room = null;
        if(home) {
            room = home.rooms.id(roomId);
        }
        return room;
    }

    return {
        addRoom: addRoom,
        removeRoom: removeRoom,
        validateRoom: validateRoom,
        Terminal: require("./terminal")(Home, mqttServer)
    };
};
