module.exports = function (Home) {

    function getUserHomes(userId, callback) {
        Home.find({ residents: userId }).exec(callback);
    };

    function getHome(homeId, callback) {
        Home.findById(homeId).exec(callback);
    };

    function addHome(homeObject, callback) {
        var home = new Home();
        home.name = homeObject.name;
        home.residents = homeObject.residents;
        home.address = homeObject.address;
        home.save(callback);
    };

    function removeHome(homeId, callback) {
        Home.findById(homeId).remove(callback);
    };

    return {
        getUserHomes: getUserHomes,
        getHome: getHome,
        addHome: addHome,
        removeHome: removeHome
    };

};