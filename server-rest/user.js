module.exports = function () {

    function logIn(req, res, user) {
        req.logIn(user, function (err) {
            if(err) {
                res.forbidden(err.toString());
            } else {
                res.ok({
                    "success" : true,
                    "message" : "User Authenticated",
                    "token" : req.user.token,
                    "userName" : req.user.userName,
                    "userId" : req.user.userId
                });
            }
        });
    }

    return {
        logIn: logIn
    };
};
