(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('eventHandler', ['$rootScope', eventHandler]);

    function eventHandler($rootScope) {
        return {
            emit: function(event) {
                $rootScope.$broadcast(event);
                console.log('[EventHandler] Emitted: ' + event);
            }
        }
    }

})();
