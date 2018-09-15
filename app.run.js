(function(){

    "use strict";

    angular
        .module('Hydra')
        .run(['$rootScope', 'sessionFactory', hydraRun]);

    function hydraRun($rootScope, sessionFactory) {
        // sessionFactory.openSession();
        // $rootScope.$on('sessionReady', function() {
        //     console.log('Session ready!');
        // });
    }

})();
