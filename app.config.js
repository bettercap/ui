(function(){

    "use strict";

    angular
        .module('Hydra')
        .config(['$httpProvider', hydraConfiguration])
        .constant('configuration', {
            apiEndpoint: 'http://localhost:8081/api/',
            appVersion: '0.0.1'
        });

    function hydraConfiguration($httpProvider) {
        // if (!$httpProvider.defaults.headers.get) {
        //     $httpProvider.defaults.headers.get = {};
        // }
        // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }

})();
