module.exports = function () {
    return {
        "name" : "homeAutomation",
        "database" : {
            "scheme" : "mongodb",
            "domain" : "localhost",
            "port" : 46632,
            "dbname" : "homeAutomation"
        },
        "mqtt" : {
            "port" : 46633,
            "database" : {
                "scheme" : "mongodb",
                "domain" : "localhost",
                "port" : 46632,
                "dbname" : "homeAutomationMqttListener",
                "collection" : "mqttListeners"
            }
        },
        "secret" : "7qkRUeqRKbi95405BvQBSrRWj284w95m",
        "sessionTimeout" : 604800
    }
};
