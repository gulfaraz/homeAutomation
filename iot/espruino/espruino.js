var wifi = require("Wifi"),
    tinyMQTT = require("tinyMQTT"),
    http = require("http"),
    flashEEPROM = require("FlashEEPROM"),
    switchList = [ 13 ],
    constant = {
        index: {
            ssid: 0,
            password: 1,
            deviceId: 2
        },
        offset: {
            homeId: 0,
            roomId: 1,
            terminalId: 2
        },
        state: {
            on: 1,
            off: 0,
            default: 0
        },
        deviceIdLength: 3
    };

var configuration = (function (switchCount, flash) {

    function readIndex(index) {
        if(storage[index] === undefined) {
            storage[index] = new Uint8Array(0);
        }
        return E.toString(storage[index]);
    }

    function loadHomeCredentials() {
        return {
            ssid: readIndex(constant.index.ssid),
            password: readIndex(constant.index.password)
        };
    }

    function loadDeviceIdList() {
        var deviceIdList = [];
        for(var deviceIdIndex=0; deviceIdIndex<switchCount; deviceIdIndex++) {
            var indexOffset = (deviceIdIndex * constant.deviceIdLength) + constant.index.deviceId;
            deviceIdList.push([
                readIndex(indexOffset + constant.offset.homeId),
                readIndex(indexOffset + constant.offset.roomId),
                readIndex(indexOffset + constant.offset.terminalId)
            ]);
        }
        return deviceIdList;
    }

    var storage = flash.readAll();
    var configuration = {};

    configuration.client = {
        ssid: "newDevice-" + wifi.getAPIP().mac.split(":").join(""),
        password: "setupnewdevice"
    };

    configuration.home = loadHomeCredentials();

    configuration.mqtt = {
        host: "10.244.119.170",
        port: 1883,
        keepAlive: 60
    };

    configuration.deviceIdList = loadDeviceIdList();

    configuration.switchCount = switchCount;

    configuration.save = function (homeCredentials, deviceIdList) {
        flash.erase();
        flash.write(constant.index.ssid, homeCredentials.ssid);
        flash.write(constant.index.password, homeCredentials.password);
        for(var deviceIdIndex in deviceIdList) {
            var indexOffset = (deviceIdIndex * constant.deviceIdLength) + constant.index.deviceId;
            var deviceId = deviceIdList[deviceIdIndex];
            flash.write(indexOffset + constant.offset.homeId, deviceId[constant.offset.homeId]);
            flash.write(indexOffset + constant.offset.roomId, deviceId[constant.offset.roomId]);
            flash.write(indexOffset + constant.offset.terminalId, deviceId[constant.offset.terminalId]);
        }
        this.home = homeCredentials;
        this.deviceIdList = deviceIdList;
        return this;
    };

    return configuration;
}(switchList.length, (new flashEEPROM())));

(function (configuration) {

    var lastPress = 0,
        timer = 0,
        pressTimeout = 2,
        resetTimeout = 5000;

    function restartDevice() {
        setTimeout(reset, resetTimeout);
    }

    setWatch(function(e) {
        console.log(timer);
        if((e.time - lastPress) < pressTimeout) {
            timer += e.time - e.lastTime;
            if(timer > resetTimeout * 0.001) {
                configuration.save({ ssid : "", password: "" }, configuration.deviceIdList);
                restartDevice();
            } else {
                lastPress = e.time;
            }
        } else {
            timer = 0;
        }
        lastPress = e.time;
    }, 0, { "repeat" : true, "edge" : "both", "debounce" : 10 });

    function startNetwork(functionName, credentials, callback) {
        wifi.stopAP();
        console.log(functionName);
        console.log(credentials);
        console.log(callback);
        wifi[functionName](credentials.ssid, { "password" : credentials.password }, function (error) {
            if(!error) {
                callback();
            }
        });
    }

    function webServer(request, response) {
        if(request.method === "POST") {
            var data = "";
            request.on("data", function(chunk) {
                if(chunk) {
                  data += chunk;
                }
                if(data.length == Number(request.headers["Content-Length"])) {
                    data = JSON.parse(data);
                    configuration.save(data.homeCredentials, data.deviceIdList);
                    response.writeHead(200);
                    response.end("Configuration Saved");
                    restartDevice();
                }
            });
        } else {
          response.writeHead(200);
          response.end(JSON.stringify(configuration));
        }
    }

    function startWebServer() {
        http.createServer(webServer).listen(80);
    }

    function connectToMQTTServer(mqttConfiguration, deviceIdList) {

        function removeDeviceId(index) {
            configuration.deviceIdList[index] = [ "", "", ""];
            configuration.save(configuration.home, configuration.deviceIdList);
            restartDevice();
        }

        function findSwitchIndex(deviceIdList, terminalId) {
            var switchIndex = -1;
            for(var deviceIdIndex in deviceIdList) {
                if(deviceIdList[deviceIdIndex][constant.offset.terminalId] == terminalId) {
                    switchIndex = deviceIdIndex;
                    break;
                }
            }
            return switchIndex;
        }

        var mqttClient = tinyMQTT.create(mqttConfiguration.host);
        mqttClient.on("connected", function () {
            for(var deviceIdIndex in deviceIdList) {
                var deviceId = deviceIdList[deviceIdIndex];
                if(deviceId[constant.offset.terminalId].length > 0) {
                    mqttClient.subscribe("+/" + deviceId[constant.offset.terminalId]);
                    mqttClient.publish("Pair/" + deviceId[constant.offset.terminalId], deviceId[constant.offset.homeId] + "/" + deviceId[constant.offset.roomId]);
                }
             }
        });
        mqttClient.on("message", function (packet) {
            var packetSplit = packet.topic.split("/");
            var topic = packetSplit[0],
                terminalId = packetSplit[1];
            var message = packet.message.substring(2);
            var switchIndex = findSwitchIndex(deviceIdList, terminalId);
            if(topic === "Control") {
                var state = constant.state.default;
                if(message === "on" || message === "off") {
                    state = constant.state[message];
                }
                digitalWrite(switchList[switchIndex], state);
            } else if(topic === "Acknowledgement") {
                if(message === "failed") {
                    removeDeviceId(switchIndex);
                }
            }
        });
        mqttClient.connect({
            port: mqttConfiguration.port,
            keep_alive: mqttConfiguration.keepAlive
        });
    }

    function setupMQTTClient() {
        connectToMQTTServer(configuration.mqtt, configuration.deviceIdList);
    }

    var mode = "startAP",
        credentials = configuration.client,
        next = startWebServer;

    if(configuration.home.ssid) {
        mode = "connect";
        credentials = configuration.home;
        next = setupMQTTClient;
    }

    startNetwork(mode, credentials, next);
}(configuration));

