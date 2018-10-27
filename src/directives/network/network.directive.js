(function(){

    "use strict";

    angular
        .module('Hydra')
        .directive('network', function() {
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
                    hosts: '=',
                    edges: '='
                },
                templateUrl: './src/directives/network/network.html',
                link: link,
                controller: ['$scope', 'eventHandler', 'networkHandler', networkController],
                controllerAs: 'nc'
            }
        });

    function link($scope, $element, $attrs) {
        /**
         * Variables
         */
        let network = undefined;
        $scope.container = $element[0].querySelector('#network');
        $scope.contextMenu = $element[0].querySelector('#context-menu');
        $scope.contextMenuItems = $element[0].querySelectorAll('.context-menu__item');
        $scope.opened = false;
        $scope.options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            locale: 'it',
            // locales: locales,
            clickToUse: false,
            nodes: {
                shape: 'hexagon',
                color: '#4169e1',
                borderWidth: 0,
                borderWidthSelected: 0,
                // title: 'Element',
                shadow: {
                    enabled: true,
                    color: 'rgba(0,0,0,0.35)',
                    x: 5,
                    y: 5
                },
                chosen: {
                    node: function(values, id, selected, hovering) {
                        console.log(values);
                        values.shadowColor = 'rgba(0,0,0,1)';
                    },
                    label: function(values, id, selected, hovering) {
                        // console.log(values);
                        // console.log(id);
                        // console.log(selected);
                        // console.log(hovering);
                    }
                }
            },
            edges: {
                color: {
                    color: '#151515'
                },
                dashes: true,
                width: 2,
                length: 250,
                hoverWidth: 2,
                shadow: {
                    enabled: true,
                    color: 'rgba(0,0,0,0.35)',
                    x: 5,
                    y: 5
                },
            },
            groups: {
                device: {
                    shapeProperties: {
                        borderDashes: false
                    },
                    color: '#4169e1',
                    shape: 'image',
                    image: {
                          unselected: '../../../assets/images/android.svg'
                    },
                    // icon: {
                    //     face: '"Font Awesome 5 Free"',
                    //     code: '',
                    //     color: '#4169e1',
                    //     size: 60
                    // },
                    font: {
                        face: "'Roboto Mono', monospace",
                        color: '#fff',
                        background: 'rgba(0,0,0,.75)',
                        // strokeWidth: 1,
                        // strokeColor: '#4169e1'
                    }
                },
                gateway: {
                    shapeProperties: {
                        borderDashes: false
                    },
                    color: '#95D855',
                    shape: 'image',
                    image: {
                        unselected: '../../../assets/images/gateway.svg'
                    },
                    label: 'Gateway',
                    margin: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                    },
                    // icon: {
                    //     face: '"Font Awesome 5 Free"',
                    //     code: '\uf519',
                    //     color: '#95D855',
                    //     size: 80
                    // },
                    font: {
                        face: "'Roboto Mono', monospace",
                        color: '#fff',
                        background: 'rgba(0,0,0,.75)',
                        // strokeWidth: 1,
                        // strokeColor: '#95D855'
                    }
                }
            },
            interaction: {
                hover: true,
                navigationButtons: false
            },
            layout: {
                randomSeed: 338972,
                hierarchical: {
                    enabled: false,
                    sortMethod: 'directed'
                },

            },
            manipulation: {
                enabled: false,
                addNode: function(nodeData,callback) {
                    nodeData.label = 'hello world';
                    callback(nodeData);
                },
                addEdge: function(edgeData,callback) {
                    if (edgeData.from === edgeData.to) {
                        var r = confirm("Do you want to connect the node to itself?");
                        if (r === true) {
                            callback(edgeData);
                        }
                    } else {
                        callback(edgeData);
                    }
                }
            }
        };
        $scope.data = {
            nodes: undefined,
            edges: undefined
        };

        /**
         * Listeners
         */
        $element.bind('contextmenu', openContextMenu);
        $scope.contextMenuItems.forEach(function(el) {
            el.addEventListener('click', function() {
                $scope.opened = false;
                $scope.$apply();
            });
        });

        /**
         * Watchers
         */
        $scope.$watch('hosts', function(hosts){
            if(hosts) {
                $scope.data.nodes = new vis.DataSet(hosts);
            }
        });
        $scope.$watch('edges', function(edges){
            if(edges) {
                $scope.data.edges = new vis.DataSet(edges);
            }
        });
        $scope.$watchCollection('data', function(data) {
            if(data.nodes.length && data.edges.length) {
                $scope.launch();
            }
        });

        /**
         * Methods
         */
        $scope.launch = function() {
            $scope.listener = false;
            network = new vis.Network($scope.container, $scope.data, $scope.options);
            // eventHandler.emit('networkStarted');
            network.on('selectNode', function(e) {
                // console.log(e);
            });
            network.on('click', function(e) {
                // console.log(e);
                // e.event = "[original event]";
                // console.log('click event, getNodeAt returns: ' + this.getNodeAt(e.pointer.DOM));
            });
            network.on('afterDrawing', function(e) {
                // console.log(e);
            });
        };
        $scope.closeContextMenu = function(e) {
            $scope.opened = false;
        };

        /**
         * Functions
         */
        function openContextMenu(e) {
            e.preventDefault();
            let coords = {
                x: e.clientX + 5,
                y: e.clientY + 5
            };
            $scope.contextMenu.style.top = coords.y + 'px';
            $scope.contextMenu.style.left = coords.x + 'px';
            $scope.opened = true;
            $scope.$apply();
        }
    }

    function networkController($scope, eventHandler, networkHandler) {
        /**
         * Variables
         */
        $scope.terminalOpened = false;

        /**
         * Watchers
         */
        $scope.$on('openTerminal', function() {
            $scope.terminalOpened = true;
            $scope.addEdge($scope.addNode());
        });
        $scope.$on('closeTerminal', function() {
            $scope.terminalOpened = false;
        });

        /**
         * Methods
         */
        $scope.addNode = function() {
            let tempNodeSample = {
                "ipv4": "192.168.1.22",
                "ipv6": "",
                "mac": "-",
                "hostname": "yamato",
                "alias": "",
                "vendor": "Apple",
                "first_seen": "2018-02-23T06:28:43.661869827+01:00",
                "last_seen": "2018-02-23T06:29:13.734671382+01:00",
                "meta": {
                    "values": {}
                }
            };
            let nodeId = Object.keys($scope.data.nodes._data).length + 1;
            let newNode = networkHandler.createNode(tempNodeSample, nodeId);
            $scope.data.nodes.add(newNode);
            return nodeId;
        };
        $scope.addEdge = function(nodeId) {
            let id = networkHandler.getRandomId();
            $scope.data.edges.add({id:id, from:$scope.data.nodes._data[0].id, to:nodeId});
        };
        $scope.openTerminal = function() {
            eventHandler.emit('openTerminal');
        };
        $scope.closeTerminal = function() {
            eventHandler.emit('closeTerminal');
        };
    }

})();
