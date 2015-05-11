'use strict';
angular.module('fsMobile.services')

    .factory('AppData', function(Resource) {

        function AppData(data) {
            angular.forEach(data, function(value, key) {
            this[key] = (key === '$metaInfo') ? value : new Resource(value);
            }.bind(this));
        }

        AppData.prototype = {
            getLocation: function(el) {
                return this.locations[el.location];
            }
        };

        return AppData;
    });
