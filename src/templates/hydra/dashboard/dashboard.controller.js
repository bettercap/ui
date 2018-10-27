(function(){

    "use strict";

    angular
        .module('Hydra')
        .controller('dashboardController', ['$scope', '$rootScope', 'networkHandler', 'sessionFactory', dashboardController]);

    function dashboardController($scope, $rootScope, networkHandler, sessionFactory) {
        /**
         * Variables
         */
        $scope.hosts = [];
        $scope.edges = [];
        $scope.modules = [];
        $scope.protocol = 'lan';
        $scope.currentModule = null;

        // Start Temp
        $rootScope.v1 = true;
        $rootScope.v2 = false;
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
        $scope.switchProtocol = function(protocol) {
            $rootScope.$broadcast('switchProtocol', protocol);
        };
        $scope.setCurrentModule = function(module) {
            $rootScope.$broadcast('setCurrentModule', module);
        };
        // End Temp


        /**
         * Listeners
         */
        $scope.$on('sessionReady', function() {
            $scope.hosts = networkHandler.getHosts();
            $scope.edges = networkHandler.getEdges($scope.hosts);
            $scope.modules = $rootScope.session.modules;
            console.log($rootScope.session);
        });
        $scope.$on('switchProtocol', function(event, protocol) {
            $scope.protocol = protocol;
        });
        $scope.$on('setCurrentModule', function(event, module) {
            $scope.currentModule = module;
            if($scope.currentModule !== null) {
                $scope.currentModule.saving = false;
            }
        });

        /**
         * Methods
         */
        $scope.saveModuleSettings = function () {
            $scope.currentModule.saving = true;

        };
        $scope.toggleModuleRunning = function (module) {
            module.running = !module.running;
        };

        /**
         * Bootstrap
         */
        sessionFactory.storeSession();

    }

})();
