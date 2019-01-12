(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('optionFactory', ['configuration', '$http', '$rootScope', 'eventHandler', optionFactory]);

    function optionFactory(configuration, $http, $rootScope, eventHandler) {
        var defaultOptions = {};
        $rootScope.options = {};
        $rootScope.$on('userOptionsSave', function() {
            console.log('Proprietà aggiornate');
            console.log($rootScope.options);
            eventHandler.emit('userOptionsUpdated');
        });
        return {
            getDefault: function() {
                return $http.get('/options-default.json')
                    .then(function(response) {
                        defaultOptions = response.data;
                        eventHandler.emit('defaultOptionsReady');
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            getOptions: function() {
                var _this = this;
                for (let prop in defaultOptions) {
                    if (defaultOptions.hasOwnProperty(prop)) {
                        if (_this.get(prop)) {
                            $rootScope.options[prop] = _this.get(prop);
                        } else {
                            $rootScope.options[prop] = defaultOptions[prop];
                        }
                    }
                }
            },
            set: function(key, value) {
                if (!value.length) {
                    localStorage.removeItem(key);
                } else {
                    localStorage.setItem(key, value);
                }
                eventHandler.emit('userOptionsUpdated');
            },
            get: function(key) {
                return localStorage.getItem(key);
            }
        }
    }

})();
