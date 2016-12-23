(function () {
    angular.module("app", [ "home", "manage", "network", "device" ])
        .controller("AppCtrl", [ "$scope", function (scope) {
            scope.title = "Setup New Device";
        }])
        .factory("TerminalService", [ "$http", function (http) {

            var terminals = [];

            function setTerminals(terminalsList) {
                terminals = terminalsList;
            }

            function getTerminals() {
                return terminals;
            }

            function fetchTerminals(credentials) {
                return http({
                    method: "POST",
                    url: "http://localhost:8080/device/free",
                    data: credentials
                });
            }

            function configureDevice(homeCredentials, deviceIdList) {
                return http({
                    method: "POST",
                    url: "http://192.168.4.1/configure",
                    data : {
                        "homeCredentials" : homeCredentials,
                        "deviceIdList" : deviceIdList
                    }
                });
            }

            function getDeviceConfiguration() {
                return http({
                    method: "GET",
                    url: "http://192.168.4.1/"
                });
            }

            function testSwitch(index) {
                return http({
                    method: "GET",
                    url: "http://192.168.4.1/?i=" + index
                });
            }

            return {
                setTerminals: setTerminals,
                getTerminals: getTerminals,
                fetchTerminals: fetchTerminals,
                configureDevice: configureDevice,
                getDeviceConfiguration: getDeviceConfiguration,
                testSwitch: testSwitch
            };
        }])
        .factory("NetworkService", [ function () {

            var WiFiControl = require("wifi-control");

            WiFiControl.init();

            var homeCredentials = {
                "ssid" : null,
                "password" : null
            };

            function connect(network, password, callback) {
                if(!callback) {
                    callback = function () {};
                }
                if(network.security === "Open" || password) {
                    var networkCredentials = {
                        "ssid" : network.ssid,
                        "password" : password
                    };
                    WiFiControl.connectToAP(networkCredentials, function (error, response) {
                        if(error) {
                            callback(error);
                        } else {
                            var interfaceState = WiFiControl.getIfaceState();
                            if(response.success && (interfaceState.ssid === network.ssid)) {
                                if(network.ssid.indexOf("newDevice-") === -1) {
                                    homeCredentials = {
                                        "ssid" : network.ssid,
                                        "password" : password
                                    };
                                }
                                callback(null, homeCredentials);
                            } else {
                                callback("failed");
                            }
                        }
                    });
                } else {
                    callback("password");
                }
            }

            function getCredentials() {
                return homeCredentials;
            }

            function find(isDevice, callback) {
                WiFiControl.scanForWiFi(function (error, response) {
                    if(error) {
                        callback(error);
                    } else {
                        var allNetworks = response.networks;
                        var uniqueNetworks = (function (networks) {
                            var uniqueNetworks = [];
                            for(var networkIndex in networks) {
                                var isUnique = true;
                                var network = networks[networkIndex];
                                for(var uniqueNetworkIndex in uniqueNetworks) {
                                    var uniqueNetwork = uniqueNetworks[uniqueNetworkIndex];
                                    if(uniqueNetwork.ssid === network.ssid) {
                                        isUnique = false;
                                        break;
                                    }
                                }
                                if(isUnique) {
                                    uniqueNetworks.push(network);
                                }
                            }
                            return uniqueNetworks;
                        }(response.networks));
                        callback(null, uniqueNetworks.filter(function (network) {
                            var isDeviceNetwork = (network.ssid.indexOf("newDevice-") === 0);
                            return (isDevice === isDeviceNetwork);
                        }));
                    }
                });
            }

            return {
                "find" : find,
                "connect" : connect,
                "getCredentials" : getCredentials
            };
        }]);
})();
