(function(){

    "use strict";

    angular
        .module('Hydra')
        .controller('dashboardController', ['$scope', '$window', '$timeout', 'networkHandler', 'sessionFactory', dashboardController]);

    function dashboardController($scope, $window, $timeout, networkHandler, sessionFactory) {
        /**
         * Variables
         */
        $scope.hosts = [];
        $scope.edges = [];
        $scope.hydraModeEnabled = false;
        $scope.hydraBtnHover = false;

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
        $scope.hydraMode = function() {
            $scope.hydraModeEnabled = !$scope.hydraModeEnabled;
        };
        $scope.enableHydraBtnHover = function() {
            $scope.hydraBtnHover = true;
        };
        $scope.disableHydraBtnHover = function() {
            $scope.hydraBtnHover = false;
        };

        //TODO: porkaround temporaneo, necessario refactoring in favore di una direttiva
        function setHydraWrapperHeight() {
            let windowHeight = $window.innerHeight;
            let headerHeight = document.querySelector('#hydraMainHeader').offsetHeight;
            document.querySelector('#hydraWrapper').style.height = windowHeight - headerHeight + 'px';
        }
        $timeout( function() {
            setHydraWrapperHeight();
        }, 500);
        $window.addEventListener('resize', setHydraWrapperHeight);
        //TODO: porkaround temporaneo, necessario refactoring in favore di una direttiva

        /**
         * Bootstrap
         */
        sessionFactory.getSession();
    }

})();
