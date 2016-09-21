module.exports = function () {
    return {
        "name" : "homeAutomation",
        "database" : {
            "scheme" : "mongodb",
            "domain" : "localhost",
            "port" : 27017,
            "dbname" : "homeAutomation"
        },
        "secret" : "gulfaraz",
        "sessionTimeout" : 1209600
    }
};
