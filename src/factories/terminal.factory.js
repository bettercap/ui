(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('terminalFactory', ['configuration', '$http', 'eventHandler', terminalFactory]);

    function terminalFactory(configuration, $http, eventHandler) {
        return {
            launchCommand: function(command) {
                return $http.post(configuration.apiEndpoint + 'session', command)
                    .then(function(response) {
                        return response;
                    })
                    .catch(function(error) {
                        return error;
                    });
            }
        }
    }

})();
