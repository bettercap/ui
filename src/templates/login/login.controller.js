(function(){

    "use strict";

    angular
        .module('Hydra')
        .controller('loginController', ['$scope', '$state', 'sessionFactory', 'authentication', loginController]);

    function loginController($scope, $state, sessionFactory, authentication) {
        $scope.credentials = {
            username: null,
            password: null
        };
        $scope.submitted = false;
        $scope.authenticate = function(e){
            e.preventDefault();
            $scope.submitted = true;
            authentication.setCredentials($scope.credentials);
        };
        $scope.$on('userLogin', function() {
            $state.go('dashboard');
        });
    }

})();
