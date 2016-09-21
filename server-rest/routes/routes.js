module.exports = function (express, auth) {
    var router = express.Router();
    var api_root = "/";
    router.get(api_root, function (req, res) {
        res.json({ "success" : true, "message" : "Welcome", "status" : "Online" });
    });
    router.use(api_root + "login", require("./login")(express.Router(), auth));
    return router;
};
