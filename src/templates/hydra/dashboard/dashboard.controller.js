(function(){

    "use strict";

    angular
        .module('Hydra')
        .controller('dashboardController', ['$scope', '$interval', '$rootScope', 'networkHandler', 'sessionFactory', 'eventHandler', 'optionFactory', dashboardController]);

    function dashboardController($scope, $interval, $rootScope, networkHandler, sessionFactory, eventHandler, optionFactory) {
        /**
         * Variables
         */
        $scope.hosts = [];
        $scope.edges = [];
        $scope.modules = [];
        $scope.protocol = 'lan';
        $scope.currentModule = null;
        $scope.optionPanel = false;

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
            $scope.currentModule = null;
            $scope.protocol = protocol;
        });
        $scope.$on('setCurrentModule', function(event, module) {
            $scope.protocol = null;
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
        $scope.toggleOptionPanel = function() {
            $scope.optionPanel = !$scope.optionPanel;
        };
        $scope.saveOption = function(k, v, event) {
            if (!event) {
                optionFactory.set(k, v);
            } else if (event && event.key === 'Enter') {
                event.preventDefault();
                optionFactory.set(k, v);
            }
        };
        /**
         * Bootstrap
         */
        sessionFactory.storeSession();
        $interval(sessionFactory.storeSession, 1000);
    }

})();
