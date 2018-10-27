(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('sessionFactory', ['configuration', 'Session', '$http', '$rootScope', 'eventHandler', sessionFactory]);

    function sessionFactory(configuration, Session, $http, $rootScope, eventHandler) {
        return {
            checkSession: function() {
                return localStorage.getItem('username') !== null && localStorage.getItem('password') !== null;
            },
            storeSession: function() {
                // return $http.get(configuration.apiEndpoint + 'session')
                return $http.get('/session-complete.mock.json')
                    .then(function(response) {
                        $rootScope.session = new Session(response.data);
                        eventHandler.emit('sessionReady');
                    })
                    .catch(function(error) {
                       console.log(error);
                    });
            }
        }
    }

})();
