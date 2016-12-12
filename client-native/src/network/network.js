(function () {
    angular.module("network", [ "ui.router" ])
        .config(["$stateProvider", "$urlRouterProvider", function (stateProvider, urlRouterProvider) {
            urlRouterProvider.otherwise("/");
            stateProvider
                .state("network", {
                    url: "/network",
                    templateUrl: "network.html",
                    controller: "NetworkCtrl"
                });
        }])
        .controller("NetworkCtrl", [ "$scope", "NetworkService", "$timeout", "$state", function (scope, networkService, timeout, state) {

            scope.scanMessage = "Looking for networks...";

            scope.credentials = { ssid: "gulfaraz", password: "7829782782" };//networkService.getCredentials();

            scope.changeNetwork = function () {
                scope.showNetworkList = true;
                scope.scanNetworks();
            };

            scope.scanNetworks = function () {
                scope.scanning = true;
                networkService.find(false, function (error, networks) {
                    if(error) {
                        scope.scanMessage = error;
                        console.error(error);
                    }
                    timeout(function () {
                        scope.scanning = false;
                        scope.networks = networks;
                        scope.scanMessage = "No Networks Found";
                    });
                });
            };

            scope.selectNetwork = function (network, password) {
                scope.connectMessage = null;
                networkService.connect(network, password, function (error, credentials) {
                    if(error) {
                        if(error === "password") {
                            if(scope.getPassword === network.ssid) {
                                scope.connectMessage = "Enter network password";
                            } else {
                                scope.getPassword = network.ssid;
                            }
                        } else if (error === "failed") {
                            scope.connectMessage = "Failed to connect to " + (network.ssid || "network");
                        } else {
                            scope.connectMessage = "Unable to connect to network, verify password";
                            console.error(error);
                        }
                    } else {
                        timeout(function () {
                            scope.getPassword = null;
                            scope.connectMessage = null;
                            scope.credentials = credentials;
                            scope.showNetworkList = false;
                            state.go("device");
                        });
                    }
                });
            };
        }]);
})();
