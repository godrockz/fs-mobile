/*jslint
    nomen: true
*/
/*global
    angular, moment, _
*/


'use strict';
angular.module('fsMobile.services')
    .factory('Resource', function () {

        function Resource(data) {
            if (data) {
                _.assign(this, data);
            }
        }

        Resource.prototype = {
            values: function () {
                return _.values(this);
            },

            sortByTime: function () {
                return _.sortBy(this.values(), 'start');
            },

            filterByTime: function (time) {
                if (time === 'now') { time = undefined; }
                return _.filter(this.values(), function (resource) {
                    if (!resource.start) { return false; }
                    var result = true;
                    if (moment(resource.start) > moment(time)) {
                        result = false;
                    }
                    if (resource.end && moment(resource.end) < moment(time)) {
                        result = false;
                    }
                    return result;
                });
            },
            groupByDay: function () {
                return _.groupBy(this.values(), function (resource) {
                    if (resource.start) {
                        return moment(resource.start)
                            .format('dddd')
                            .toLowerCase();
                    }
                    return 'unknown';
                });
            },
            groupByLocation: function () {
                return _.groupBy(this.values(), function (resource) {
                    if (resource.locationRef) {
                        return resource.locationRef;
                    }
                    return 'unknown';
                });
            },
            filterByEventCategory: function (cat, neq) {
                return _.filter(this.values(), function (resource) {
                    if (!resource.eventCategory) { return false; }
                    var result = neq || false;
                    if (resource.eventCategory === cat) {
                        result = !neq;
                    }
                    return result;
                });

            }

        };

        return Resource;
    });
