(function(){

    "use strict";

    angular
        .module('Hydra')
        .config(['$stateProvider', '$urlRouterProvider', Router]);

    function Router($stateProvider, $urlRouterProvider){
        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'loginController',
                templateUrl: './src/templates/login/login.html'
            })
            .state('dashboard', {
                url: '/',
                controller: 'dashboardController',
                templateUrl: './src/templates/hydra/dashboard/dashboard.html'
            });
        $urlRouterProvider.otherwise('/');
    }

})();
