'use strict';
angular.module('fsMobile.services')

    .factory('Resource', function() {

        function Resource(data) {
            if (data) {
                _.assign(this, data);
            }
        }

        Resource.prototype = {
            values: function() {
                return _.values(this);
            },

            sortByTime: function() {
                return _.sortBy(this.values(), 'start')
            },

            filterByTime: function(time) {
                if (time === 'now') time = undefined;
                return _.filter(this.values(), function(resource) {
                    if (!resource.start) return false;
                    var result = true;
                    if (moment(resource.start) > moment(time)){
                        result = false;
                    }
                    if (resource.end && moment(resource.end) < moment(time)) {
                        result = false;
                    }
                    return result;
                });
                return _.sortBy(this.values(), 'start')
            },
            groupByDay: function() {
                return _.groupBy(this.values(), function(resource) {
                    if (resource.start) {
                        return moment(resource.start)
                            .format('dddd')
                            .toLowerCase();
                    } else {
                        return 'unknown';
                    }
                });
                //return _.sortBy(this.values(), 'start')
            },
            groupByLocation: function() {
                return _.groupBy(this.values(), function(resource) {
                    if (resource.location) {
                        return resource.location;
                    } else {
                        return 'unknown';
                    }
                });
                return _.sortBy(this.values(), 'start')
            },
            filterByEventCategory: function(cat,neq) {
                return _.filter(this.values(), function(resource) {
                    if (!resource.eventCategory) return false;
                    var result = neq?neq:false;
                    if (resource.eventCategory === cat){
                        result = !neq;
                    }
                    return result;
                });

            }

        };

        return Resource;
    });
