(function(){

    "use strict";

    angular
        .module('Hydra')
        .component('login', {
            bindings: {
                authorized: '='
            },
            templateUrl: './src/templates/login/login.html',
            controllerAs: 'login',
            controller: function($scope, $element, $attrs) {


            }
        });

})();
