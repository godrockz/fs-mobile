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
            groupByDay: function (values) {
                values = values || this.values();
                return _.groupBy(values, function (resource) {
                    if (resource.start) {
                        return moment(resource.start).startOf('day').format();
                    }
                    return 'unknown';
                });
            },
            groupByLocation: function (values) {
                values = values || this.values();
                return _.groupBy(values, function (resource) {
                    if (resource.locationRef) {
                        return resource.locationRef;
                    }
                    return 'unknown';
                });
            },
            filterByEventCategory: function (cat, exclude) {
                exclude = exclude || false;
                return _.filter(this.values(), function (resource) {
                    if (!resource.eventCategory) { return false; }
                    if (resource.eventCategory === cat) {
                        return !exclude;
                    }
                    return exclude;
                });

            }

        };

        return Resource;
    });
