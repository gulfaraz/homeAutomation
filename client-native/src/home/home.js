(function () {
    angular.module("home", [ "ui.router" ])
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
            scope.fetchTerminals = function () {
                var credentials = {
                    "userName": scope.userName,
                    "password": scope.password
                };
                terminalService.fetchTerminals(credentials).then(function (response) {
                    if(response.data.terminals.length) {
                        terminalService.setTerminals(response.data.terminals);
                        state.go("manage");
                    }
                }).finally(function (response) {
                    scope.message = response.data.message;
                });
            };
        }]);
})();
