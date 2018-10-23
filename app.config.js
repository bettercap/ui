(function(){

    "use strict";

    angular
        .module('Hydra')
        .config(['$httpProvider', hydraConfiguration])
        .constant('configuration', {
            apiEndpoint: 'https://127.0.0.1:8081/api/',
            appVersion: '0.0.1'
        });

    function hydraConfiguration($httpProvider) {
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.patch = {};
        // if (!$httpProvider.defaults.headers.get) {
        //     $httpProvider.defaults.headers.get = {};
        // }
        // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    }

})();
