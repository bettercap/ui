(function(){

    "use strict";

    angular
        .module('Hydra')
        .run(['$rootScope', 'sessionFactory', '$transitions', hydraRun]);

    function hydraRun($rootScope, sessionFactory, $transitions) {
        $transitions.onBefore({}, function (transition) {
            let logged = sessionFactory.checkSession();
            if(transition.to().name !== 'login'){
                if (!logged) {
                    return transition.router.stateService.target('login');
                }
            } else {
                if (logged) {
                    //TODO: rimanere nello stato attuale anzichè redirect verso dashboard
                    return transition.router.stateService.target('dashboard');
                }
            }
        });
    }

})();
