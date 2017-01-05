(function () {
    angular.module("app", [ "home", "manage", "network", "device" ])
        .controller("AppCtrl", [ "$scope", "TerminalService", "$state", "$rootScope", "$timeout", function (scope, terminalService, state, rootScope, timeout) {

            var selectTab = function (tabName) {
                var elementList = document.querySelectorAll(".mdl-layout__tab");
                angular.forEach(elementList, function (element, index) {
                    element = angular.element(element);
                    element.removeClass("is-active");
                    if(element.hasClass(tabName + "-tab")) {
                        element.addClass("is-active");
                    }
                });
            };

            scope.goTo = function (routeName) {
                state.go(routeName, {}, {reload: true});
            };

            rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                timeout(function () {
                    scope.loading = true;
                });
            });

            rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                timeout(function () {
                    selectTab(fromState.name);
                    scope.currentState = toState;
                    componentHandler.upgradeAllRegistered();
                    scope.loading = false;
                });
            });

            rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
                if(error.go) {
                    scope.goTo(error.go);
                    scope.loading = false;
                }
            });
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
                    url: "http://localhost:8080/device/terminals",
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
                if(network.security === "NONE" || password) {
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
        }])
        .directive("timeSince", ["$timeout", function (timeout) {
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
