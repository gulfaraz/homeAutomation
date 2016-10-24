module.exports = function (Home) {

    function getUserHomes(userId, callback) {
        Home.find({ residents: userId }).exec(function (err, home) {
            if(err) {
                callback(err);
            } else {
                callback(null, home);
            }
        });
    };

    function getHome(homeId, callback) {
        Home.findById(homeId).exec(function (err, home) {
            if(err) {
                callback(err);
            } else {
                callback(null, home);
            }
        });
    };

    function addHome(homeObject, callback) {
        var home = new Home();
        home.name = homeObject.name;
        home.residents = homeObject.residents;
        home.address = homeObject.address;
        home.save(function (err) {
            if(err) {
                callback(err);
            } else {
                callback(null, home);
            }
        });
    };

    return {
        getUserHomes: getUserHomes,
        getHome: getHome,
        addHome: addHome
    };

};