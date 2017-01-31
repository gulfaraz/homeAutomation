(function () {
    angular.module("app", [ "home", "manage", "network", "device" ])
        .controller("AppCtrl", [ "$scope", "TerminalService", "$state", "$rootScope", "$timeout", function (scope, terminalService, state, rootScope, timeout) {

            var selectTab = function (tabName) {
                var elementList = document.querySelectorAll(".mdl-layout__tab");
                angular.forEach(elementList, function (element, index) {
                    element = angular.element(element);
                    element.removeClass("is-active");
                    if(element.hasClass(tabName + "-tab")) {
                        element.addClass("is-active");
                    }
                });
            };

            scope.goTo = function (routeName) {
                state.go(routeName, {}, {reload: true});
            };

            rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
                timeout(function () {
                    scope.loading = true;
                });
            });

            rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
                timeout(function () {
                    selectTab(fromState.name);
                    scope.currentState = toState;
                    componentHandler.upgradeAllRegistered();
                    scope.loading = false;
                });
            });

            rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
                if(error.go) {
                    scope.goTo(error.go);
                    scope.loading = false;
                }
            });
        }]);
})();
