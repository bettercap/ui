(function(){

    "use strict";

    angular
        .module('Hydra')
        .directive('terminal', function() {
            return {
                restrict: 'E',
                scope: {
                    /**
                     * Isolated scope explained ;)
                     *
                     * "@"   Text binding / one-way binding
                     * "="   Direct model binding / two-way binding
                     * "&"   Behaviour binding / Method binding
                     **/
                },
                templateUrl: './src/directives/terminal/terminal.html',
                link: link,
                controller: ['$scope', '$rootScope', '$window', 'eventHandler', 'terminalFactory', terminalController],
                controllerAs: 'tc'
            }
        });

    function link($scope, $element, $attrs) {
        /**
         * Watchers
         */
        $scope.$on('openTerminal', function() {
            // This prevent the .btn-terminal remaing focused after clicked on it
            document.querySelector('*:focus') ? document.querySelector('*:focus').blur() : '';
        });
    }

    function terminalController($scope, $rootScope, $window, eventHandler, terminalFactory) {
        /**
         * Variables
         */
        $scope.terminal = false;
        $scope.minimized = false;
        $scope.maximized = false;
        $scope.currentLine = '';
        $scope.totalLine = [];
        $scope.lastLogin = undefined;

        /**
         * Listeners
         */
        $scope.$on('openTerminal', function() {
            $scope.lastLogin = getCurrentTime();
            $scope.terminal = true;
        });
        $scope.$on('closeTerminal', function() {
            $scope.terminal = false;
            $scope.minimized = false;
            $scope.maximized = false;
        });
        $scope.$on('minimizeTerminal', function() {
            $scope.minimized = true;
            $scope.maximized = false;
        });
        $scope.$on('maximizeTerminal', function() {
            $scope.maximized = true;
            $scope.minimized = false;
        });

        /**
         * Watchers
         */
        $scope.$watch('terminal', function(newVal, oldVal) {
            if(newVal){
                $window.addEventListener('keydown', sendInputToTerminal);
            } else {
                $window.removeEventListener('keydown', sendInputToTerminal)
            }
        });

        /**
         * Methods
         */
        $scope.closeTerminal = function() {
            eventHandler.emit('closeTerminal');
        };
        $scope.minimizeTerminal = function() {
            eventHandler.emit('minimizeTerminal');
        };
        $scope.maximizeTerminal = function() {
            eventHandler.emit('maximizeTerminal');
        };

        /**
         * Functions
         */
        function getCurrentTime() {
            let currentdate = new Date();
            let date = {
                d: currentdate.getDate(),
                m: currentdate.getMonth() + 1,
                y: currentdate.getFullYear(),
                hh: currentdate.getHours(),
                mm: currentdate.getMinutes(),
                ss: currentdate.getSeconds()
            };
            for(let prop in date) {
                if(date.hasOwnProperty(prop)) {
                    if(date[prop] < 10) {
                        date[prop] = '0' + date[prop];
                    }
                }
            }
            return 'Last login: ' + date.d + '/' + date.m + '/' + date.y + ' @ ' + date.hh + ':' + date.mm + ':' + date.ss;
        }
        function sendInputToTerminal(e) {
            console.log(e);
            e.preventDefault();
            if (e.which === 8) {
                // Detect backspace
                $scope.currentLine = $scope.currentLine.slice(0, $scope.currentLine.length - 1);
            } else if (e.which === 13) {
                // Detect enter
                let command = {
                    cmd: $scope.currentLine
                };
                let newLine = {
                    command: $scope.currentLine,
                    success: undefined,
                    message: undefined
                };
                //YOU ARE HERE
                terminalFactory.launchCommand(command)
                    .then(function(response) {
                        console.log(response);
                        if(response.data.success) {
                            // $scope.totalLine.push($scope.currentLine);
                            newLine.success = response.data.success;
                            newLine.message = response.data.message;


                        } else {


                        }
                    })
                    .catch(function(error) {

                    })
                    .finally(function(response) {
                        if(response.data.success){
                            eventHandler.emit('commandAccepted');
                        } else {
                            eventHandler.emit('commandRefused');
                        }
                        $scope.totalLine.push(newLine);
                        $scope.currentLine = '';
                    });
            } else {
                // Detect any other key
                $scope.currentLine += e.key;
            }
            $scope.$apply();
        }
    }

})();
