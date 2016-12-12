module.exports = function (Home, mqttServer) {

    function getUserHomes(userId, callback) {
        Home.find({ residents: userId }).exec(callback);
    }

    function getHome(homeId, callback) {
        var home = getHome(homeId);
        if(home) {
            home.exec(callback);
        } else {
            callback("Home Not Found");
        }
    }

    function addHome(homeObject, callback) {
        var home = new Home();
        home.homeName = homeObject.homeName;
        home.residents = homeObject.residents;
        home.address = homeObject.address;
        home.save(callback);
    }

    function removeHome(homeId, callback) {
        var home = getHome(homeId);
        if(home) {
            home.remove(callback);
        } else {
            callback("Home Not Found");
        }
    }

    function validateHome(homeObject, callback) {
        if(homeObject.homeName && homeObject.homeName.length > 0) {
            callback(null, homeObject);
        } else {
            callback("homeName is missing");
        }
    }

    function getHome(homeId) {
        var home = null;
        var foundHome = Home.findById(homeId);
        if(foundHome) {
            home = foundHome;
        }
        return home;
    }

    return {
        getUserHomes: getUserHomes,
        getHome: getHome,
        addHome: addHome,
        removeHome: removeHome,
        validateHome: validateHome,
        Room: require("./room")(Home, mqttServer)
    };
};
