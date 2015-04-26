'use strict';
angular.module('fsMobile.services')

    .factory('Resource', function() {

        function Resource(data) {
            if (data) _.assign(this, data);
        };

        Resource.prototype = {
            values: function() {
                return _.values(this);
            },
        };

        return Resource;
    });
