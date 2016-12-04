(function () {
    angular.module("manage", [ "ui.router" ])
        .config(["$stateProvider", "$urlRouterProvider", function (stateProvider, urlRouterProvider) {
            urlRouterProvider.otherwise("/");
            stateProvider
                .state("manage", {
                    url: "/",
                    templateUrl: "manage.html",
                    controller: "ManageCtrl"
                });
        }])
        .controller("ManageCtrl", [ "$scope", "TerminalService", "$timeout", function (scope, terminalService, timeout) {

            var WiFiControl = require("wifi-control");

            WiFiControl.init();

            scope.terminals = terminalService.getTerminals();
            scope.scanMessage = "Looking for networks...";

            scope.selectedTerminal = null;

            scope.homeNetwork = {
                "isSet" : false,
                "configuring" : false,
                "credentials" : {
                    "ssid" : null,
                    "password" : null
                },
                "set" : function () {
                    this.configuring = true;
                    scope.scanNetworks();
                }
            };

            scope.configureTerminal = function (terminal) {
                scope.configuring = true;
                scope.selectedTerminal = terminal;
                scope.scanNetworks();
            };

            scope.changeTerminal = function (terminal) {
                scope.configuring = false;
                scope.selectedTerminal = null;
                scope.scanning = false;
                scope.networks = null;
                scope.scanMessage = "Looking for networks...";
            };

            scope.scanNetworks = function () {
                scope.scanning = true;
                WiFiControl.scanForWiFi(function (err, response) {
                    if(err) {
                        console.error(err);
                    }
                    timeout(function () {
                        scope.scanning = false;
                        scope.networks = response.networks;
                        scope.scanMessage = "No Networks Found";
                    });
                });
            };

            scope.connectNetwork = function (network, password, callback) {
                scope.connectMessage = null;

                if(network.security === "Open" || password || (network.ssid === scope.getPassword)) {

                    if(network.security === "Open" || password) {

                        var networkCredentials = {
                            "ssid" : network.ssid,
                            "password" : password
                        };

                        WiFiControl.connectToAP(networkCredentials, function (err, response) {
                            if(err) {
                                console.error(err);
                            }
                            timeout(function () {
                                var interfaceState = WiFiControl.getIfaceState();
                                if(response.success && (interfaceState.ssid === network.ssid)) {
                                    callback(network, password);
                                } else {
                                    scope.connectMessage = "Failed to connect to " + (network.ssid || "network");
                                }
                            });
                        });
                    } else {
                        scope.connectMessage = "Enter network password";
                    }
                } else {
                    scope.getPassword = network.ssid;
                }
            };

            scope.configureTerminalCallback = function () {
                scope.getPassword = null;
                scope.connectMessage = null;
                scope.linking = true;
                scope.closeLinkModal = false;
                scope.linkMessage = "Linking device to terminal...";
                var deviceId = [ scope.selectedTerminal.homeId, scope.selectedTerminal.roomId, scope.selectedTerminal.terminalId ];
                terminalService.configureTerminal(scope.homeNetwork.credentials, deviceId).then(function (response) {
                    console.log("Configuration Success");
                }, function (response) {
                    console.log("Configuration Failed");
                }).finally(function (response) {
                    var message = "Success/Failure in link";
                    if(!response) {
                        message = "Please check if you've connected to the correct network";
                    } else {
                        if(response.data && response.data.message) {
                            message = response.data.message;
                        }
                    }
                    scope.linkMessage = message;
                    scope.closeLinkModal = true;


                        WiFiControl.connectToAP(networkCredentials, function (err, response) {
                            if(err) {
                                console.error(err);
                            }
                            timeout(function () {
                                var interfaceState = WiFiControl.getIfaceState();
                                if(response.success && (interfaceState.ssid === network.ssid)) {
                                    callback(network, password);
                                } else {
                                    scope.connectMessage = "Failed to connect to " + (network.ssid || "network");
                                }
                            });
                        });
                });
            };

            scope.setHomeNetworkCallback = function (network, password) {
                scope.getPassword = null;
                scope.connectMessage = null;
                scope.homeNetwork.credentials = {
                    "ssid" : network.ssid,
                    "password" : password
                };
                scope.homeNetwork.isSet = true;
                scope.homeNetwork.configuring = false;
            };

            scope.closeLinking = function (response) {
                scope.linking = false;
            };
        }]);
})();
