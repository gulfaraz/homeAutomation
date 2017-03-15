(function () {
    angular.module("home", [ "common" ])
        .config(["$stateProvider", "$urlRouterProvider", function (stateProvider, urlRouterProvider) {
            urlRouterProvider.otherwise("/");
            stateProvider
                .state("home", {
                    url: "/",
                    templateUrl: "home.html",
                    controller: "HomeCtrl"
                });
        }])
        .controller("HomeCtrl", [ "$scope", "$http", "TerminalService", "$state", function (scope, http, terminalService, state) {
            var dialog = document.querySelector("#dialog");

            scope.fetchTerminals = function () {
                var credentials = {
                    "userName": scope.userName,
                    "password": scope.password
                };
                terminalService.fetchTerminals(credentials).then(function (response) {
                    if(response.data.terminals.length) {
                        terminalService.setTerminals(response.data.terminals);
                        state.go("device");
                    } else {
                        scope.message = "No Terminals Available";
                        dialog.showModal();
                    }
                }, function (response) {
                    scope.message = response.data ? response.data.message : "Server Unavailable";
                    dialog.showModal();
                });
            };

            scope.closeDialog = function () {
                dialog.close();
                scope.message = "";
            };
        }]);
})();
