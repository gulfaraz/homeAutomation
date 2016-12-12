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
            }, function (response) {
                scope.message = "Please check if you have connected to the correct device";
            });

            scope.getTerminalType = function (terminalId) {
                var type = null;
                for(var terminalIndex in scope.terminalList) {
                    var terminal = scope.terminalList[terminalIndex];
                    if(terminal.terminalId === terminalId) {
                        type = terminal.type;
                        break;
                    }
                }
                return type;
            };

            scope.setupDevice = function (homeCredentials, deviceIdList) {
                for(var deviceIdIndex=0,len=scope.switchList.length; deviceIdIndex<len; deviceIdIndex++) {
                    var deviceId = deviceIdList[deviceIdIndex];
                    if(!deviceId) {
                        deviceIdList[deviceIdIndex] = [ "", "", "" ];
                    }
                }
                terminalService.configureDevice(homeCredentials, deviceIdList).then(function (response) {
                    console.log("Configuration Success");
                }, function (response) {
                    console.log("Configuration Failed");
                });
            };
        }]);
})();
