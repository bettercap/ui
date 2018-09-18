(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('networkHandler', ['$rootScope', networkHandler]);

    function networkHandler($rootScope) {
        function Node(obj, id, group) {
            let node = {};
            node.alias = obj.alias;
            node.first_seen = obj.first_seen;
            node.hostname = obj.hostname;
            node.id = id;
            node.ipv4 = obj.ipv4;
            node.ipv6 = obj.ipv6;
            node.label = obj.label ? obj.label : obj.ipv4;
            node.last_seen = obj.last_seen;
            node.mac = obj.mac;
            node.meta = obj.meta;
            node.vendor = obj.vendor;
            node.group = group;
            return node;
        }
        return {
            getHosts: function() {
                let hosts = [];
                let gateway = Node($rootScope.session.gateway, 0, 'gateway');
                hosts.push(gateway);
                $rootScope.session.lan.hosts.forEach(function(el, index){
                    let node = Node(el, index + 1, 'device');
                    hosts.push(node);
                });
                return hosts;
            },
            getEdges: function(hosts) {
                let edges = [];
                let gatewayId = undefined;
                hosts.forEach(function(el){
                    if(el.group === 'gateway'){
                        gatewayId = el.id;
                    }
                    if(el.group !== 'gateway'){
                        edges.push({from:gatewayId, to:el.id});
                    }
                });
                return edges;
            }
        }
    }

})();
