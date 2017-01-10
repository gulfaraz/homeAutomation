var wifi = require("Wifi"),
    tinyMQTT = require("tinyMQTT"),
    http = require("http"),
    flashEEPROM = require("FlashEEPROM"),
    switchList = [ 13, 12 ],
    homeDefault = {
        ssid : "",
        password: ""
    },
    defaultDeviceId = "//";

var configuration = (function (switchCount, flash) {

    function readIndex(index) {
        if(storage[index] === undefined) {
            storage[index] = new Uint8Array(0);
        }
        return E.toString(storage[index]);
    }

    function loadHomeCredentials() {
        return {
            ssid: readIndex(0),
            password: readIndex(1)
        };
    }

    function loadDeviceIdList() {
        var deviceIdList = [];
        for(var deviceIdIndex=2; deviceIdIndex<(switchCount+2); deviceIdIndex++) {
            var deviceId = readIndex(deviceIdIndex);
            if(!deviceId) {
                deviceId = defaultDeviceId;
            }
            deviceIdList.push(deviceId);
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
        host: "10.244.220.86",
        port: 1883,
        keepAlive: 60
    };

    configuration.deviceIdList = loadDeviceIdList();

    configuration.switchCount = switchCount;

    configuration.save = function (homeCredentials, deviceIdList) {
        flash.erase();
        flash.write(0, homeCredentials.ssid);
        flash.write(1, homeCredentials.password);
        for(var deviceIdIndex in deviceIdList) {
            var deviceId = deviceIdList[deviceIdIndex];
            flash.write(2 + deviceIdIndex, deviceId);
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
        resetTimeout = 5000,
        subscribeTimeout = 500,
        firmwareMaxLength = 3000;

    function restartDevice() {
        setTimeout(require("ESP8266").reboot, resetTimeout);
    }

    setWatch(function(e) {
        console.log(timer);
        if((e.time - lastPress) < pressTimeout) {
            timer += e.time - e.lastTime;
            if(timer > resetTimeout * 0.001) {
                configuration.save(homeDefault, configuration.deviceIdList);
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
        console.log(credentials);
        wifi[functionName](credentials.ssid, { "password" : credentials.password }, function (error) {
            if(!error) {
                initializeSwitches();
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
            var params = url.parse(request.url, true);
            if (params.query && "i" in params.query) {
                var switchNumber = switchList[params.query.i];
                digitalWrite(switchNumber, (!digitalRead(switchNumber) ? 1 : 0));
                response.end(JSON.stringify({ state : digitalRead(switchNumber) }));
            } else {
                response.end(JSON.stringify(configuration));
            }
        }
    }

    function startWebServer() {
        http.createServer(webServer).listen(80);
    }

    function initializeSwitches() {
        for(var switchIndex in switchList) {
            pinMode(switchList[switchIndex], "output");
            digitalWrite(switchList[switchIndex], 0);
        }
    }

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

    function fetchFirmware() {
        http.get("http://" + configuration.mqtt.host + ":8080/device/firmware", function (response) {
            var data = "";
            response.on("data", function (chunk) {
                if(data.length < firmwareMaxLength) {
                    data += chunk;
                }
            });
            response.on("close", function () {
                data = JSON.parse(data);
                try {
                    eval(data.firmware); // jshint ignore:line
                } catch (e) {
                    setupMQTTClient();
                }
            });
        });
    }

    var mode = "startAP",
        credentials = configuration.client,
        next = startWebServer;

    if(configuration.home.ssid) {
        mode = "connect";
        credentials = configuration.home;
        next = fetchFirmware;
    }

    startNetwork(mode, credentials, next);
}(configuration));

