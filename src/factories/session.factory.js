(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('sessionFactory', ['$http', 'eventHandler', sessionFactory]);

    function sessionFactory($http, eventHandler) {
        return {
            openSession: function() {
                return $http.get('https://192.168.1.8:8083/api/session')
                    .then(function(response) {
                        console.log(response);
                        eventHandler.emit('sessionReady');
                    })
                    .catch(function(error) {
                       console.log(error);
                    });
            }
        }
    }

})();
