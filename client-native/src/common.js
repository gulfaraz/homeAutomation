(function () {
    angular.module("common", [ "ui.router" ])
        .constant("resolve", {
            "terminals" : [ "$q", "TerminalService", function (q, terminalService) {
                var deferred = q.defer();
                if(terminalService.getTerminals().length > 0) {
                    deferred.resolve();
                } else {
                    deferred.reject({ go : "home" });
                }
                return deferred.promise;
            }],
            "network" : [ "$q", "NetworkService", function (q, networkService) {
                var deferred = q.defer();
                var credentials = networkService.getCredentials();
                if(credentials.ssid && credentials.ssid.length > 0) {
                    deferred.resolve();
                } else {
                    deferred.reject({ go : "network" });
                }
                return deferred.promise;
            }],
            "device" : [ "$q", "TerminalService", "$timeout", function (q, terminalService, timeout) {
                var deferred = q.defer();
                q.race( [ terminalService.getDeviceConfiguration(), (new Promise(function (resolve, reject) {
                    setTimeout(reject, 3000);
                })) ]).then(function (response) {
                    deferred.resolve();
                }, function (response) {
                    deferred.reject({ go : "device" });
                });
                return deferred.promise;
            }]
        });
})();
