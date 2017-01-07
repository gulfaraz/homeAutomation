(function () {
    angular.module("device", [ "common" ])
        .config(["$stateProvider", "$urlRouterProvider", "resolve", function (stateProvider, urlRouterProvider, resolve) {
            urlRouterProvider.otherwise("/");
            stateProvider
                .state("device", {
                    url: "/device",
                    templateUrl: "device.html",
                    controller: "DeviceCtrl",
                    resolve: {
                        "terminals" : resolve.terminals,
                        "network" : resolve.network
                    }
                });
        }])
        .controller("DeviceCtrl", [ "$scope", "NetworkService", "$timeout", "$state", function (scope, networkService, timeout, state) {

            scope.scanMessage = "Scanning...";

            scope.scanDevices = function () {
                if(scope.timeoutInstance) {
                    timeout.cancel(scope.timeoutInstance);
                }
                scope.scanMessage = "Scanning...";
                scope.scanning = true;
                networkService.find(true, function (error, devices) {
                    if(error) {
                        scope.scanMessage = error;
                        console.error(error);
                    }
                    timeout(function () {
                        scope.scanning = false;
                        scope.devices = devices;
                        if(scope.devices.length > 0) {
                            scope.scanMessage = scope.devices.length + " Device" + (devices.length > 1 ? "s" : "") + " Found";

                        } else {
                            scope.scanMessage = "No Devices Found";
                        }
                    });
                });
                scope.timeoutInstance = timeout(function () {
                    scope.scanDevices();
                }, 3000);
            };

            scope.scanDevices();

            scope.connectDevice = function (network) {
                scope.selectedDevice = network;
                scope.connectMessage = null;
                networkService.connect(network, "setupnewdevice", function (error, credentials) {
                    if(error) {
                        if (error === "failed") {
                            scope.connectMessage = "Failed to connect to " + (network.ssid || "device");
                        } else {
                            scope.connectMessage = "Unable to connect to device, hold the reset button and try again";
                            console.error(error);
                        }
                        var homeCredentials = networkService.getCredentials();
                        networkService.connect({ ssid: homeCredentials.ssid }, homeCredentials.password);
                    } else {
                        timeout(function () {
                            scope.connectMessage = null;
                            state.go("manage");
                        });
                    }
                });
            };
        }]);
})();
