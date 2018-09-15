(function(){

    "use strict";

    angular
        .module('Hydra')
        .config(['$httpProvider', hydraConfiguration]);

    function hydraConfiguration($httpProvider) {
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }

})();
