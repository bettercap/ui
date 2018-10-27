(function(){

    "use strict";

    angular
        .module('Hydra')
        .factory('Session', [function() {

            /**
             * Session constructor
             * @param obj
             * @constructor
             */
            function Session(obj) {
                this.active = obj.active;
                this.ble = obj.ble;
                this.env = obj.env;
                this.gateway = obj.gateway;
                this.gps = obj.gps;
                this.interface = obj.interface;
                this.lan = obj.lan;
                this.modules = obj.modules;
                this.options = obj.options;
                this.packets = obj.packets;
                this.started_at = moment(obj.started_at);
                this.wifi = obj.wifi;
                this._bindPacketsToIp();
                // this._storeModules(obj.modules);
            }

            /**
             * @description Return gateway
             * @returns {Object}
             */
            Session.prototype.getGateway = function() {
                return this.gateway;
            };

            /**
             * @description Return array of modules
             * @returns {Array}
             */
            Session.prototype.getModules = function() {
                return this.modules;
            };

            /**
             * @description Retrieve session started time as string
             * @returns {String}
             */
            Session.prototype.getStartedTime = function() {
                return this.started_at.format('MMMM Do YYYY, h:mm:ss a');
            };

            /**
             * @description Bind traffic packets to corresponding ip address
             * @private
             */
            Session.prototype._bindPacketsToIp = function() {
                var _this = this;
                this.lan.hosts.forEach(function(el) {
                    for (let prop in _this.packets.Traffic) {
                        if (_this.packets.Traffic.hasOwnProperty(prop) && prop === el.ipv4) {
                            el.packets = _this.packets.Traffic[prop];
                        }
                    }
                });
            };

            // Session.prototype._storeModules = function(modules) {
            //     var _this = this;
            //     modules.forEach(function(module) {
            //         _this.modules[module.name] = new Module(module);
            //     });
            // };
            //
            // function Module(module) {
            //     this.name = module.name;
            //     this.description = module.description;
            //     this.author = module.author;
            //     this.running = module.running;
            //     this.parameters = module.parameters;
            // }

            /**
             * @description Return Session
             * @return {Object}
             */
            return Session;

        }]);

})();
