(function () {
    angular.module("network", [ "common" ])
        .config(["$stateProvider", "$urlRouterProvider", "resolve", function (stateProvider, urlRouterProvider, resolve) {
            urlRouterProvider.otherwise("/");
            stateProvider
                .state("network", {
                    url: "/network",
                    templateUrl: "network.html",
                    controller: "NetworkCtrl",
                    resolve: {
                        "terminals" : resolve.terminals,
                        "device" : resolve.device
                    }
                });
        }])
        .controller("NetworkCtrl", [ "$scope", "DeviceService", "ConfigurationService", "$timeout", "$state", "settings", function (scope, deviceService, configurationService, timeout, state, settings) {

            scope.scanMessage = "Scanning...";

            scope.credentials = configurationService.getCredentials();

            var networkPasswordDialog = document.querySelector("#networkPasswordDialog");

            scope.changeNetwork = function () {
                scope.scanNetworks();
            };

            scope.scanNetworks = function () {
                if(scope.timeoutInstance) {
                    timeout.cancel(scope.timeoutInstance);
                }
                scope.scanMessage = "Scanning...";
                scope.scanning = true;
                deviceService.scanNetworks().then(function (response) {
                    scope.scanning = false;
                    scope.networks = response.data;
                    if(scope.networks.length > 0) {
                        scope.scanMessage = scope.networks.length + " Network" + (scope.networks.length > 1 ? "s" : "") + " Found";
                    } else {
                        scope.scanMessage = "No Networks Found";
                    }
                }, function (reject) {
                    scope.scanMessage = "Failed to scan networks";
                    console.error(reject);
                });
                scope.timeoutInstance = timeout(function () {
                    scope.scanNetworks();
                }, settings.networkScanInterval);
            };

            scope.scanNetworks();

            scope.openNetworkPasswordModal = function (networkSSID) {
                scope.selectedNetwork = networkSSID;
                scope.connectMessage = null;
                networkPasswordDialog.showModal();
            };

            scope.testNetwork = function (password) {
                var credentials = { ssid : scope.selectedNetwork, password : password };
                deviceService.testNetwork(credentials).then(function (response) {
                    scope.connectMessage = null;
                    scope.credentials = configurationService.setCredentials(credentials);
                    state.go("manage");
                }, function (reject) {
                    scope.connectMessage = "Unable to connect to network, verify password";
                    console.error(reject);
                });
            };

            scope.closeNetworkPasswordDialog = function () {
                scope.password = "";
                scope.connectMessage = null;
                networkPasswordDialog.close();
            };
        }]);
})();
