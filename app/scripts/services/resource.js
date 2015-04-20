'use strict';
angular.module('fsMobile.services')

    .factory('Resource', function (storageManager) {

        function Resource(name) {
            this.load(name);
        };

        Resource.prototype = {
            load: function(name) {
                storageManager.fetch(name)
                              .then(this.update.bind(this));
            },
            update: function(json) {
                if (json) _.assign(this, JSON.parse(json));
            },
            values: function() {
                return _.values(this);
            },
        };

        return Resource;
    });
