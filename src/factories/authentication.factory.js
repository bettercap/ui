(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('authentication', ['eventHandler', authentication]);

    function authentication(eventHandler) {
        function checkLocalStorage(){
            if (typeof localStorage !== 'undefined') {
                try {
                    localStorage.setItem('localstorage', 'localstorage');
                    if (localStorage.getItem('localstorage') === 'localstorage') {
                        localStorage.removeItem('localstorage');
                        return true;
                    } else {
                        // localStorage is disabled
                        return false;
                    }
                } catch(e) {
                    // localStorage is disabled
                    return false;
                }
            } else {
                // localStorage is not available
                return false;
            }
        }
        return {
            setCredentials: function(credentials) {
                if (checkLocalStorage()){
                    localStorage.setItem('username', credentials.username);
                    localStorage.setItem('password', credentials.password);
                    eventHandler.emit('userLogin');
                } else {
                    //TODO: su browser senza localStorage, ripiegare su cookie (?)
                }
            },
            clearCredentials: function() {
                if (checkLocalStorage()){
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                    eventHandler.emit('userLogout');
                } else {
                    //TODO: leggi sopra :)
                }
            }
        }
    }

})();
