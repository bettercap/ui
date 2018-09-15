(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('authentication', ['eventHandler', authentication]);

    function authentication(eventHandler) {
        let authorized = false;
        let credentials = {};
        return {
            checkCredentials: function(credentials) {
                if(!credentials.hasOwnProperty('username') || !credentials.hasOwnProperty('password')) {
                    authorized = false;
                    eventHandler.emit('missingCredentials');
                }

            }
        }
    }

})();
