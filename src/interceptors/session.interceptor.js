(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('sessionInterceptor', ['configuration', '$rootScope', '$q', sessionInterceptor])
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.interceptors.push('sessionInterceptor');
        }]);

    function sessionInterceptor(configuration, $rootScope, $q) {
        return {
            request: function(config) {
                console.log('Request:');
                console.log(config);
                return $q.resolve(config);
            },
            response: function(response) {
                console.log('Response');
                console.log(response);
                return $q.resolve(response);
            },
            requestError: function(rejectReason) {
                console.log('Request Error:');
                console.log(rejectReason);
                return $q.reject(rejectReason);
            },
            responseError: function(response) {
                console.log('Response Error:');
                console.log(response);
                return $q.reject(response);
            }
        }
    }

})();
