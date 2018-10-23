(function(){

    "use strict";

    angular
        .module('Hydra')
        .controller('dashboardController', ['$scope', '$rootScope', '$interval','networkHandler', 'sessionFactory', dashboardController]);

    function dashboardController($scope, $rootScope, $interval, networkHandler, sessionFactory) {
        /**
         * Variables
         */
        // $scope.session = sessionFactory.getSession();
        $scope.hosts = [];
        $scope.edges = [];
        $scope.protocol = 'lan';

        // Start Temp
        $rootScope.v1 = false;
        $rootScope.v2 = true;
        $rootScope.view1 = function() {
            $rootScope.v1 = true;
            $rootScope.v2 = false;
        };
        $rootScope.view2 = function() {
            $rootScope.v1 = false;
            $rootScope.v2 = true;
        };
        $scope.hosts.forEach(function(el) {
            el.showMeta = false;
        });
        $rootScope.toggleMeta = function(host) {
            host.showMeta = !host.showMeta;
        };
        $rootScope.switchProtocol = function(protocol) {
            $rootScope.$broadcast('switchProtocol', protocol);
        };
        // End Temp


        /**
         * Listeners
         */
        $scope.$on('sessionReady', function() {
            $scope.hosts = networkHandler.getHosts();
            $scope.edges = networkHandler.getEdges($scope.hosts);
        });
        $scope.$on('switchProtocol', function(event, protocol) {
            $scope.protocol = protocol;
        });

        /**
         * Methods
         */


        /**
         * Bootstrap
         */
        // $interval(function() {
            sessionFactory.getSession();
        // }, 500);

    }

})();
