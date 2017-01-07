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
                        "terminals" : resolve.terminals
                    }
                });
        }])
        .controller("NetworkCtrl", [ "$scope", "NetworkService", "$timeout", "$state", function (scope, networkService, timeout, state) {

            scope.scanMessage = "Scanning...";

            scope.credentials = networkService.getCredentials();

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
                networkService.find(false, function (error, networks) {
                    if(error) {
                        scope.scanMessage = error;
                        console.error(error);
                    }
                    timeout(function () {
                        scope.scanning = false;
                        scope.networks = networks;
                        if(scope.networks.length > 0) {
                            scope.scanMessage = scope.networks.length + " Network" + (scope.networks.length > 1 ? "s" : "") + " Found";
                        } else {
                            scope.scanMessage = "No Networks Found";
                        }
                    });
                });
                scope.timeoutInstance = timeout(function () {
                    scope.scanNetworks();
                }, 3000);
            };

            scope.scanNetworks();

            scope.selectNetwork = function (network, password) {
                scope.selectedNetwork = network;
                scope.connectMessage = null;
                networkService.connect(network, password, function (error, credentials) {
                    if(error) {
                        if(error === "password") {
                            networkPasswordDialog.showModal();
                        } else if (error === "failed") {
                            scope.connectMessage = "Failed to connect to " + (network.ssid || "network");
                        } else {
                            scope.connectMessage = "Unable to connect to network, verify password";
                            console.error(error);
                        }
                    } else {
                        timeout(function () {
                            scope.connectMessage = null;
                            scope.credentials = credentials;
                            state.go("device");
                        });
                    }
                });
            };

            scope.closeNetworkPasswordDialog = function () {
                scope.password = "";
                scope.connectMessage = null;
                networkPasswordDialog.close();
            };
        }]);
})();
