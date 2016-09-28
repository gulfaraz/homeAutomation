module.exports = function (Home) {

    var Home = require("./home")(Home);

    function logIn(req, res, user) {
        req.logIn(user, function (err) {
            if(err) {
                res.forbidden(err.toString());
            } else {
                Home.getHome(req.user.userId, function (err, home) {
                    if(err) {
                        res.error(err.toString());
                    } else {
                        res.ok({
                            "success" : true,
                            "message" : "User Authenticated",
                            "token" : req.user.token,
                            "userName" : req.user.userName,
                            "userId" : req.user.userId,
                            "home" : home
                        });
                    }
                })
            }
        });
    };

    return {
        logIn: logIn
    };
};
