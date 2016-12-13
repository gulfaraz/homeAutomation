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

        var persistenceSettings = {
            "factory" : mosca.persistence.Mongo,
            "url" : mqttURI
        };

        var mqttServerSettings = {
            "port" : mqttConfiguration.port,
            "backend" : ascoltatore,
            "persistence" : persistenceSettings
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

        var messageTopics = [ "Control", "State", "Acknowledgement", "Pair" ];
        var functionPostfix = "Broadcast";

        for(var messageTopicIndex in messageTopics) {
            var messageTopic = messageTopics[messageTopicIndex];

            mqttServer[messageTopic.toLowerCase() + functionPostfix] = (function (messageTopic) {
                return (function (terminalId, message, qos, retain) {
                    if(terminalId) {
                        var packet = {
                            "topic" : messageTopic + "/" + terminalId,
                            "payload" : message,
                            "qos" : qos || 1,
                            "retain": !!retain
                        };
                        mqttServer.publish(packet, function () {
                            console.log(messageTopic + " Message Sent");
                        });
                    } else {
                        console.error("Failed to send message - terminalId not found");
                    }
                });
            })(messageTopic);
        }

        return mqttServer;
    })(mqttConfiguration);
};
