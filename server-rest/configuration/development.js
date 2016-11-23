module.exports = function () {
    return {
        "name" : "homeAutomation",
        "database" : {
            "scheme" : "mongodb",
            "domain" : "localhost",
            "port" : 27017,
            "dbname" : "homeAutomation"
        },
        "mqtt" : {
            "port" : 1883,
            "database" : {
                "scheme" : "mongodb",
                "domain" : "localhost",
                "port" : 27017,
                "dbname" : "homeAutomationMqttListener",
                "collection" : "mqttListeners"
            }
        },
        "secret" : "gulfaraz",
        "sessionTimeout" : 1209600
    }
};
