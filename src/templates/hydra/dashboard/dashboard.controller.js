(function(){

    "use strict";

    angular
        .module('Hydra')
        .controller('dashboardController', ['$scope', 'sessionFactory', dashboardController]);

    function dashboardController($scope, sessionFactory) {
        $scope.session = undefined;
        sessionFactory.getSession()
            .then(function(response) {
               $scope.session = response;
            });
    }

})();
