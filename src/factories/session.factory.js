(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('sessionFactory', ['configuration', '$http', '$rootScope', 'eventHandler', sessionFactory]);

    function sessionFactory(configuration, $http, $rootScope, eventHandler) {
        function bindPacketsToIp(packets, ip) {
            for (let prop in packets) {
                if (packets.hasOwnProperty(prop) && prop === ip) {
                    return packets[prop];
                }
            }
        }
        return {
            checkSession: function() {
                return localStorage.getItem('username') !== null && localStorage.getItem('password') !== null;
            },
            getSession: function() {
                // return $http.get(configuration.apiEndpoint + 'session')
                return $http.get('/session-complete.mock.json')
                    .then(function(response) {
                        response.data.lan.hosts.forEach(function(el) {
                            el.packets = bindPacketsToIp(response.data.packets.Traffic, el.ipv4);
                        });
                        $rootScope.session = response.data;
                        eventHandler.emit('sessionReady');
                        console.log($rootScope.session);
                    })
                    .catch(function(error) {
                       console.log(error);
                    });
            }
        }
    }

})();
