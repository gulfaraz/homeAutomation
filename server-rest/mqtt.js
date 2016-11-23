module.exports = function (mqttConfiguration) {

    return (function (mqttConfiguration) {

        var mosca = require("mosca");

        var mqttURI = mqttConfiguration.database.scheme + "://" + mqttConfiguration.database.domain + "/" + mqttConfiguration.database.dbname;

        var ascoltatore = {
            "type" : "mongo",
            "url" : mqttURI,
            "pubsubCollection" : mqttConfiguration.database.collection,
            "mongo" : {}
        };

        var mqttServerSettings = {
            "port" : mqttConfiguration.port,
            "backend" : ascoltatore
        };

        var mqttServer = new mosca.Server(mqttServerSettings);

        mqttServer.on("ready", function () {
            console.log("mqttServer is up and running");
        });

        mqttServer.on("clientConnected", function (client) {
            console.log("Client Connected : ", client.id);
        });

        mqttServer.on("clientDisconnected", function (client) {
            console.log("Client Disconnected : ", client.id);
        });

        mqttServer.on("published", function (packet, client) {
            var message = (new String(packet.payload)).toString();
            console.log("Published : ", message, " - Client : ", (client ? client.id : "None"), " - Topic : " + packet.topic);
        });

        var messageTopics = [ "Control", "State", "Acknowledgement" ];
        var functionPostfix = "Broadcast";

        for(var messageTopicIndex in messageTopics) {
            var messageTopic = messageTopics[messageTopicIndex];

            mqttServer[messageTopic.toLowerCase() + functionPostfix] = (function (messageTopic) {

                return (function (terminalId, message, qos, retain) {

                    var packet = {
                        "topic" : messageTopic + "/" + terminalId,
                        "payload" : message,
                        "qos" : qos || 1,
                        "retain": !!retain
                    };

                    mqttServer.publish(packet, function () {
                        console.log(messageTopic + " Message Sent");
                    });
                });

            })(messageTopic);
        }

        return mqttServer;
    })(mqttConfiguration);
};
