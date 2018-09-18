(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('sessionFactory', ['configuration', '$http', '$rootScope', 'eventHandler', sessionFactory]);

    function sessionFactory(configuration, $http, $rootScope, eventHandler) {
        return {
            checkSession: function() {
                return localStorage.getItem('username') !== null && localStorage.getItem('password') !== null;
            },
            getSession: function() {
                return $http.get(configuration.apiEndpoint + 'session')
                // return $http.get('/session.mock.json')
                    .then(function(response) {
                        $rootScope.session = response.data;
                        eventHandler.emit('sessionReady');
                    })
                    .catch(function(error) {
                       console.log(error);
                    });
            }
        }
    }

})();
