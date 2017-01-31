(function () {
    angular.module("common", [ "ui.router" ])
        .constant("settings", {
            "serverAddress" : "raidms.com:8080",
            "deviceServerAddress" : "192.168.4.1",
            "deviceNetworkPrefix" : "HomeConnect-",
            "deviceNetworkPassword" : "setupnewdevice",
            "requestTimeout" : 3000,
            "networkScanInterval" : 60000,
            "deviceScanInterval" : 3000
        })
        .constant("resolve", {
            "terminals" : [ "$q", "TerminalService", function (q, terminalService) {
                var deferred = q.defer();
                if(terminalService.getTerminals().length > 0) {
                    deferred.resolve();
                } else {
                    deferred.reject({ go : "home" });
                }
                return deferred.promise;
            }],
            "network" : [ "$q", "ConfigurationService", function (q, configurationService) {
                var deferred = q.defer();
                var credentials = configurationService.getCredentials();
                if(credentials.ssid && credentials.ssid.length > 0) {
                    deferred.resolve();
                } else {
                    deferred.reject({ go : "network" });
                }
                return deferred.promise;
            }],
            "device" : [ "$q", "DeviceService", "settings", function (q, deviceService, settings) {
                var deferred = q.defer();
                q.race( [ deviceService.getDeviceConfiguration(), (new Promise(function (resolve, reject) {
                    setTimeout(reject, settings.requestTimeout);
                })) ]).then(function (response) {
                    deferred.resolve();
                }, function (response) {
                    deferred.reject({ go : "device" });
                });
                return deferred.promise;
            }]
        })
        .factory("DeviceService", [ "$http", "settings", function (http, settings) {

            function configureDevice(homeCredentials, deviceIdList) {
                return http({
                    method: "POST",
                    url: "http://" + settings.deviceServerAddress + "/",
                    data : {
                        "homeCredentials" : homeCredentials,
                        "deviceIdList" : deviceIdList
                    }
                });
            }

            function getDeviceConfiguration() {
                return http({
                    method: "GET",
                    url: "http://" + settings.deviceServerAddress + "/"
                });
            }

            function scanNetworks() {
                return http({
                    method: "PUT",
                    url: "http://" + settings.deviceServerAddress + "/?s",
                    data: {}
                });
            }

            function testNetwork(credentials) {
                return http({
                    method: "PUT",
                    url: "http://" + settings.deviceServerAddress + "/",
                    data : credentials
                });
            }

            function testSwitch(index) {
                return http({
                    method: "GET",
                    url: "http://" + settings.deviceServerAddress + "/?i=" + index
                });
            }

            return {
                configureDevice: configureDevice,
                getDeviceConfiguration: getDeviceConfiguration,
                scanNetworks: scanNetworks,
                testNetwork: testNetwork,
                testSwitch: testSwitch
            };
        }])
        .factory("TerminalService", [ "$http", "settings", function (http, settings) {

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
                    url: "http://" + settings.serverAddress + "/device/terminals",
                    data: credentials
                });
            }

            return {
                setTerminals: setTerminals,
                getTerminals: getTerminals,
                fetchTerminals: fetchTerminals
            };
        }])
        .factory("ConfigurationService", [ function () {

            var homeCredentials = {
                "ssid" : null,
                "password" : null
            };

            function getCredentials() {
                return homeCredentials;
            }

            function setCredentials(credentials) {
                homeCredentials = credentials;
                return homeCredentials;
            }

            return {
                getCredentials: getCredentials,
                setCredentials: setCredentials
            };
        }])
        .factory("NetworkService", [ "settings", function (settings) {

            var WiFiControl = require("wifi-control");

            WiFiControl.init();

            function find(callback) {
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
                            return (network.ssid.indexOf(settings.deviceNetworkPrefix) === 0);
                        }));
                    }
                });
            }

            function connect(ssid, callback) {
                WiFiControl.connectToAP({
                    "ssid" : ssid,
                    "password" : settings.deviceNetworkPassword
                }, function (error, response) {
                    if(error) {
                        callback(error);
                    } else {
                        var interfaceState = WiFiControl.getIfaceState();
                        if(response.success && (interfaceState.ssid === ssid)) {
                            callback(null, ssid);
                        } else {
                            callback("Failed to connect to " + (ssid || "device"));
                        }
                    }
                });
            }

            function restore(credentials, callback) {
                WiFiControl.connectToAP({
                    "ssid" : credentials.ssid,
                    "password" : credentials.password
                }, function (error, response) {
                    if(error) {
                        callback(error);
                    } else {
                        var interfaceState = WiFiControl.getIfaceState();
                        if(response.success && (interfaceState.ssid === credentials.ssid)) {
                            callback(null, credentials.ssid);
                        } else {
                            callback("Failed to connect to " + (credentials.ssid || "network"));
                        }
                    }
                });
            }

            return {
                "find" : find,
                "connect" : connect,
                "restore" : restore
            };
        }])
        .directive("timeSince", [ "$timeout", function (timeout) {
            return {
                "restrict" : "A",
                "link" : function (scope, element, attrs, ctrl) {

                    var updater;

                    updateTimeout(0);

                    function updateTimeout(newTimeout) {
                        timeout.cancel(updater);
                        updater = timeout(function () {
                            element.html(timeSince(new Date(attrs.timeSince)));
                        }, newTimeout);
                    }

                    function timeSince(date) {
                        var seconds = Math.floor((new Date() - date) / 1000);
                        var interval = Math.floor(seconds / 31536000);
                        var timeSinceText = "";
                        if (interval >= 1) {
                            updateTimeout((1000 * 60 * 60 * 24 * 90) - 50);
                            timeSinceText = interval + " year" + ((interval > 1) ? "s" : "") + " ago";
                        } else {
                            interval = Math.floor(seconds / 2592000);
                            if (interval >= 1) {
                                updateTimeout((1000 * 60 * 60 * 24 * 15) - 50);
                                timeSinceText = interval + " month" + ((interval > 1) ? "s" : "") + " ago";
                            } else {
                                interval = Math.floor(seconds / 86400);
                                if (interval >= 1) {
                                    updateTimeout((1000 * 60 * 60 * 24) - 50);
                                    timeSinceText = interval + " day" + ((interval > 1) ? "s" : "") + " ago";
                                } else {
                                    interval = Math.floor(seconds / 3600);
                                    if (interval >= 1) {
                                        updateTimeout((1000 * 60 * 60) - 50);
                                        timeSinceText = interval + " hour" + ((interval > 1) ? "s" : "") + " ago";
                                    } else {
                                        interval = Math.floor(seconds / 60);
                                        if (interval >= 1) {
                                            updateTimeout((1000 * 60) - 50);
                                            timeSinceText = interval + " minute" + ((interval > 1) ? "s" : "") + " ago";
                                        } else {
                                            updateTimeout(1000 - 50);
                                            timeSinceText = Math.floor(seconds) + " seconds ago";
                                        }
                                    }
                                }
                            }
                        }
                        return timeSinceText;
                    }
                }
            };
        }]);
})();
