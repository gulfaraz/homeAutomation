(function () {
    var subscribeTimeout = 500;

    function connectToMQTTServer(mqttConfiguration, deviceIdList) {

        function removeDeviceId(switchIndex) {
            digitalWrite(switchList[switchIndex], 0);
            deviceIdList[switchIndex] = defaultDeviceId;
            var homeCredentials = (deviceIdList.map(e=>e.length).reduce((a,b)=>a+b,0) > (defaultDeviceId.length * switchList.length)) ? configuration.home : homeDefault;
            configuration.save(homeCredentials, deviceIdList);
            restartDevice();
        }

        var mqttClient = tinyMQTT.create(mqttConfiguration.host);

        function publishState(deviceId, switchNumber) {
            mqttClient.publish("State/" + deviceId, (digitalRead(switchNumber) === 1) ? "on" : "off");
        }

        mqttClient.on("connected", function () {
            function subscribeDevice(deviceId) {
                mqttClient.subscribe("+/" + deviceId);
                mqttClient.publish("Pair/" + deviceId, "link");
            }
            for(var deviceIdIndex in deviceIdList) {
                var deviceId = deviceIdList[deviceIdIndex];
                if(deviceId.length > defaultDeviceId.length) {
                    setTimeout(subscribeDevice, (deviceIdIndex + 1) * subscribeTimeout, deviceId);
                }
             }
        });

        mqttClient.on("message", function (packet) {
            var packetSplit = packet.topic.split("/");
            var topic = packetSplit.shift(),
                currentDeviceId = packetSplit.join("/");
            var message = packet.message.substring(2);
            var currentSwitchList = deviceIdList.map((deviceId, index)=>((deviceId == currentDeviceId) ? switchList[index] : 0));
            for(var switchIndex in currentSwitchList) {
                var switchNumber = currentSwitchList[switchIndex];
                if(switchNumber) {
                    if(topic === "Control") {
                        digitalWrite(switchNumber, (message === "on" ? 1 : 0));
                        publishState(currentDeviceId, switchNumber);
                    } else if(topic === "Acknowledgement") {
                        if(message === "failed") {
                            removeDeviceId(switchIndex);
                        } else if (message === "state") {
                            publishState(currentDeviceId, switchNumber);
                        }
                    } else if(topic === "Pair") {
                        if(message === "false") {
                            removeDeviceId(switchIndex);
                        }
                    }
                }
            }
        });
        mqttClient.on("disconnected", function () {
            mqttClient.connect();
        });
        mqttClient.connect({
            port: mqttConfiguration.port,
            keep_alive: mqttConfiguration.keepAlive
        });
    }

    function setupMQTTClient() {
        connectToMQTTServer(configuration.mqtt, configuration.deviceIdList);
    }

    setupMQTTClient();
})();
