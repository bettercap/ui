(function(){

    "use strict";

    angular
        .module('Hydra')
        .config(['$stateProvider', '$urlRouterProvider', Router]);

    function Router($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('dashboard', {
                url: '/',
                templateUrl: './src/templates/views/dashboard.html',
                resolve: function() {
                    return true;
                }
            });
        $urlRouterProvider.otherwise('/');
    }

})();
