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
                        "terminals" : resolve.terminals
                    }
                });
        }])
        .controller("DeviceCtrl", [ "$scope", "NetworkService", "$timeout", "$state", "settings", function (scope, networkService, timeout, state, settings) {
            var dialog = document.querySelector("#dialog");

            scope.scanMessage = "Scanning...";

            scope.scanDevices = function () {
                if(scope.timeoutInstance) {
                    timeout.cancel(scope.timeoutInstance);
                }
                scope.scanMessage = "Scanning...";
                scope.scanning = true;
                networkService.find(function (error, devices) {
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
                }, settings.deviceScanInterval);
            };

            scope.scanDevices();

            scope.connectDevice = function (deviceSSID) {
                scope.selectedDevice = deviceSSID;
                scope.message = null;
                networkService.connect(deviceSSID, function (error, credentials) {
                    if(error) {
                        scope.message = "Could not connect to device";
                        console.error(error);
                        dialog.showModal();
                    } else {
                        scope.message = null;
                        state.go("network");
                    }
                });
            };

            scope.closeDialog = function () {
                dialog.close();
                scope.message = "";
            };
        }]);
})();
