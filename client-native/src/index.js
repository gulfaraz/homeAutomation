(function () {
    angular.module("app", [ "home", "manage" ])
        .controller("AppCtrl", [ "$scope", function (scope) {
            scope.title = "Setup New Device";
        }])
        .factory("TerminalService", [ "$http", function (http) {

            var terminals = [];

            function setTerminals(terminalsList) {
                terminals = terminalsList;
            }

            function getTerminals() {
                return terminals;
            }

            function fetchTerminals(credentials) {
                return http({
                    method: "POST",
                    url: "http://localhost:8080/device/free",
                    data: credentials
                });
            }

            function configureTerminal(homeCredentials, deviceId) {
                return http({
                    method: "POST",
                    url: "http://192.168.4.1/configure",
                    data : {
                        "homeCredentials" : homeCredentials,
                        "deviceId" : deviceId
                    }
                });
            }

            return {
                setTerminals: setTerminals,
                getTerminals: getTerminals,
                fetchTerminals: fetchTerminals,
                configureTerminal: configureTerminal
            };
        }]);
})();
