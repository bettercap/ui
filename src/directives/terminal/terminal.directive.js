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
        let commandIndex = 0;
        $scope.terminal = false;
        $scope.minimized = false;
        $scope.maximized = false;
        $scope.currentLine = '';
        $scope.totalLine = [];
        $scope.lastLogin = undefined;
        $scope.sendCommand = false;

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
            return 'Last login: ' +
                date.d + '/' +
                date.m + '/' +
                date.y + ' @ ' +
                date.hh + ':' +
                date.mm + ':' +
                date.ss;
        }
        function previousCommand() {
            console.log('Current index: ' + commandIndex);
            // if (commandIndex === 0) {
            //     // commandIndex++;
            //     // $scope.currentLine = $scope.totalLine[commandIndex].command;
            // }
            // if ($scope.currentLine === '') {
            //     $scope.currentLine = $scope.totalLine[commandIndex].command;
            // } else {
            //     // commandIndex = ($scope.totalLine.length - 1) -
            // }
            if (commandIndex >= 0 && commandIndex < $scope.totalLine.length) {
                $scope.currentLine = $scope.totalLine[commandIndex].command;
                if (commandIndex + 1 < $scope.totalLine.length) {
                    commandIndex++;
                }
            }
        }
        function nextCommand() {
            console.log('Current index: ' + commandIndex);
            if (commandIndex >= 0 && commandIndex < $scope.totalLine.length) {
                if (commandIndex === 0) {
                    $scope.currentLine = '';
                } else {
                    commandIndex--;
                    $scope.currentLine = $scope.totalLine[commandIndex].command;
                }
            }
        }
        function sendInputToTerminal(e) {
            // console.log(e);
            e.preventDefault();
            if (e.which === 8) {
                // Detect backspace
                $scope.currentLine = $scope.currentLine.slice(0, $scope.currentLine.length - 1);
            } else if (e.which === 38) {
                // Detect arrowUp
                previousCommand();
            } else if (e.which === 40) {
                // Detect arrowDown
                nextCommand();
            } else if (e.which === 13) {
                // Detect enter
                if ($scope.currentLine.toLowerCase() === 'exit') {
                    eventHandler.emit('closeTerminal');
                    $scope.currentLine = '';
                } else {
                    $scope.sendCommand = true;
                    let command = {
                        cmd: $scope.currentLine
                    };
                    terminalFactory.launchCommand(command)
                        .then(function(response) {
                            let newLine = {
                                command: $scope.currentLine,
                                success: undefined,
                                message: undefined
                            };
                            if(response.data.success) {
                                // $scope.totalLine.push($scope.currentLine);
                                newLine.success = response.data.success;
                                newLine.message = response.data.msg.length ? response.data.msg : 'Executed';
                                eventHandler.emit('commandAccepted');
                            } else {
                                newLine.success = false;
                                newLine.message = response.data;
                                eventHandler.emit('commandRefused');
                            }
                            $scope.totalLine.unshift(newLine);
                            console.log($scope.totalLine);
                            commandIndex = 0;
                            // if (commandIndex === undefined) {
                            //     commandIndex = 0;
                            // }
                            $scope.currentLine = '';
                        })
                        .catch(function(error) {
                            console.log(error);
                        })
                        .finally(function() {
                            $scope.sendCommand = false;
                        });
                }
            } else {
                // Detect any other key
                $scope.currentLine += e.key;
            }
            $scope.$apply();
        }
    }

})();
