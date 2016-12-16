(function () {
    angular.module("manage", [ "ui.router" ])
        .config(["$stateProvider", "$urlRouterProvider", function (stateProvider, urlRouterProvider) {
            urlRouterProvider.otherwise("/");
            stateProvider
                .state("manage", {
                    url: "/manage",
                    templateUrl: "manage.html",
                    controller: "ManageCtrl"
                });
        }])
        .controller("ManageCtrl", [ "$scope", "TerminalService", "NetworkService", "$timeout", "$state", function (scope, terminalService, networkService, timeout, state) {

            scope.terminalList = terminalService.getTerminals();
            if(scope.terminalList.length === 0) {
                alert("You do not have any terminals to configure");
                state.go("home");
            }

            scope.homeCredentials = networkService.getCredentials();

            scope.deviceIdList = [];

            scope.switchList = [];

            terminalService.getDeviceConfiguration().then(function (response) {
                scope.switchList.length = response.data.switchCount;
                scope.deviceIdList = response.data.deviceIdList;
            }, function (response) {
                scope.message = "Please check if you have connected to the correct device";
            });

            scope.getTerminalProperty = function (property, deviceId) {
                var terminalId = (deviceId) ? deviceId.split("/")[2] : null;
                var propertyValue = null;
                if(terminalId) {
                    for(var terminalIndex in scope.terminalList) {
                        var terminal = scope.terminalList[terminalIndex];
                        if(terminal.terminalId === terminalId) {
                            propertyValue = terminal[property];
                            break;
                        }
                    }
                }
                return propertyValue;
            };

            scope.setupDevice = function (homeCredentials, deviceIdList) {
                deviceIdList = deviceIdList.map(function (deviceId, deviceIdIndex) {
                    return (deviceId ? deviceId : "//");
                });
                terminalService.configureDevice(homeCredentials, deviceIdList).then(function (response) {
                    console.log("Configuration Success");
                    networkService.connect({ ssid: homeCredentials.ssid }, homeCredentials.password, function (error, credentials) {
                        state.go("home");
                    });
                }, function (response) {
                    console.log("Configuration Failed");
                });
            };
        }]);
})();
