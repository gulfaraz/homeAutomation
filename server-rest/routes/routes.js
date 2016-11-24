module.exports = function (express, auth, modules) {
    var router = express.Router();
    var api_root = "/";

    router.use(function(req, res, next) {

        res.forbidden = function (message) {
            res.status(401).json(message);
        };

        res.error = function (message) {
            res.status(500).json(message);
        };

        res.ok = function (data) {
            res.status(200).json(data);
        };

        next();
    });

    router.get(api_root, function (req, res) {
        res.json({ "success" : true, "message" : "Welcome", "status" : "Online" });
    });
    router.use(api_root + "login", require("./login")(express.Router(), auth, modules.User));
    router.use(api_root + "home", require("./home")(express.Router(), auth, modules.Home));
    return router;
};
