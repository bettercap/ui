(function(){

    "use strict";

    angular
        .module('Hydra', ['ui.router'])
        .run(['$rootScope', '$window', '$timeout', '$state', 'eventHandler', 'authentication', 'optionFactory', hydraController]);

    function hydraController($rootScope, $window, $timeout, $state, eventHandler, authentication, optionFactory) {
        /**
         * Variables
         */
        $rootScope.hydraModeEnabled = false;
        $rootScope.hydraBtnHover = false;
        $rootScope.terminal = false;
        $rootScope.terminalBtnHover = false;

        /**
         * Listeners
         */
        $rootScope.$on('userLogout', function() {
            $state.go('login');
        });
        $rootScope.$on('openTerminal', function() {
            $rootScope.terminal = true;
        });
        $rootScope.$on('closeTerminal', function() {
            $rootScope.terminal = false;
        });
        $rootScope.$on('defaultOptionsReady', function() {
            optionFactory.getOptions();
        });
        $rootScope.$on('userOptionsUpdated', function() {
            optionFactory.getOptions();
        });
        // $rootScope.$on('defaultOptionsReady', function() {
        //     console.log($rootScope.options);
        //     optionFactory.getOptions();
        // });

        /**
         * Emitters
         */


        /**
         * Methods
         */
        $rootScope.hydraMode = function() {
            $rootScope.hydraModeEnabled = !$rootScope.hydraModeEnabled;
        };
        $rootScope.enableBtnHover = function(button) {
            $rootScope[button] = true;
        };
        $rootScope.disableBtnHover = function(button) {
            $rootScope[button] = false;
        };
        $rootScope.logout = function() {
            authentication.clearCredentials();
        };
        $rootScope.toggleTerminal = function() {
            if ($rootScope.terminal) {
                eventHandler.emit('closeTerminal');
            } else {
                eventHandler.emit('openTerminal');
            }
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

        optionFactory.getDefault();
    }

})();
