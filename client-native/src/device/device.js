(function () {
    angular.module("device", [ "ui.router" ])
        .config(["$stateProvider", "$urlRouterProvider", function (stateProvider, urlRouterProvider) {
            urlRouterProvider.otherwise("/");
            stateProvider
                .state("device", {
                    url: "/device",
                    templateUrl: "device.html",
                    controller: "DeviceCtrl"
                });
        }])
        .controller("DeviceCtrl", [ "$scope", "NetworkService", "$timeout", "$state", function (scope, networkService, timeout, state) {

            scope.scanMessage = "Looking for devices...";

            scope.scanDevices = function () {
                scope.scanning = true;
                networkService.find(true, function (error, devices) {
                    if(error) {
                        scope.scanMessage = error;
                        console.error(error);
                    }
                    timeout(function () {
                        scope.scanning = false;
                        scope.devices = devices;
                        scope.scanMessage = "No Devices Found";
                    });
                });
            };

            scope.scanDevices();

            scope.connectDevice = function (network, password) {
                scope.connectMessage = null;
                networkService.connect(network, password, function (error, credentials) {
                    if(error) {
                        if(error === "password") {
                            if(scope.getPassword === network.ssid) {
                                scope.connectMessage = "Enter device password";
                            } else {
                                scope.getPassword = network.ssid;
                            }
                        } else if (error === "failed") {
                            scope.connectMessage = "Failed to connect to " + (network.ssid || "device");
                        } else {
                            scope.connectMessage = "Unable to connect to device, verify password";
                            console.error(error);
                        }
                        var homeCredentials = networkService.getCredentials();
                        networkService.connect({ ssid: homeCredentials.ssid }, homeCredentials.password);
                    } else {
                        timeout(function () {
                            scope.getPassword = null;
                            scope.connectMessage = null;
                            state.go("manage");
                        });
                    }
                });
            };
        }]);
})();
