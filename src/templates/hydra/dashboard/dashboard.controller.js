(function(){

    "use strict";

    angular
        .module('Hydra')
        .controller('dashboardController', ['$scope', 'networkHandler', 'sessionFactory', dashboardController]);

    function dashboardController($scope, networkHandler, sessionFactory) {
        /**
         * Variables
         */
        $scope.hosts = [];
        $scope.edges = [];

        /**
         * Listeners
         */
        $scope.$on('sessionReady', function() {
            $scope.hosts = networkHandler.getHosts();
            $scope.edges = networkHandler.getEdges($scope.hosts);
        });

        /**
         * Methods
         */


        /**
         * Bootstrap
         */
        sessionFactory.getSession();
    }

})();
