module.exports = function (Home) {

    function getUserHomes(userId, callback) {
        Home.find({ residents: userId }).exec(callback);
    };

    function getHome(homeId, callback) {
        Home.findById(homeId).exec(callback);
    };

    function addHome(homeObject, callback) {
        var home = new Home();
        home.homeName = homeObject.homeName;
        home.residents = homeObject.residents;
        home.address = homeObject.address;
        home.save(callback);
    };

    function removeHome(homeId, callback) {
        Home.findById(homeId).remove(callback);
    };

    function validateHome(homeObject, callback) {
        if(homeObject.homeName && homeObject.homeName.length > 0) {
            callback(null, homeObject);
        } else {
            callback("homeName is missing");
        }
    };

    return {
        getUserHomes: getUserHomes,
        getHome: getHome,
        addHome: addHome,
        removeHome: removeHome,
        validateHome: validateHome,
        Room: require("./room")(Home)
    };
};
