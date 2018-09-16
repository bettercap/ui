(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('sessionFactory', ['configuration', '$http', 'eventHandler', sessionFactory]);

    function sessionFactory(configuration, $http, eventHandler) {
        return {
            checkSession: function() {
                return localStorage.getItem('username') !== null && localStorage.getItem('password') !== null;
            },
            getSession: function() {
                return $http.get(configuration.apiEndpoint + 'session')
                    .then(function(response) {
                        console.log(response);
                        return response;
                    })
                    .catch(function(error) {
                       console.log(error);
                    });
            }
        }
    }

})();
