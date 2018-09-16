(function(){

    "use strict";

    angular
        .module('Hydra')
        .config(['$httpProvider', hydraConfiguration])
        .constant('configuration', {
            apiEndpoint: 'https://192.168.1.8:8083/api/'
        });

    function hydraConfiguration($httpProvider) {
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }

})();
