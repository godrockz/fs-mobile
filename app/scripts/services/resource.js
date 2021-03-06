/*jslint
    nomen: true
*/
/*global
    angular, moment, _
*/


'use strict';
angular.module('fsMobile.services')
    .factory('Resource', function (filterNonPublishedFilter) {

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
            /**
             *
             * @param values
             * @param dayLimit a HH:mm:ss string defining the time of day entries should be
             * grouped to previous day. defaults to 00:00:00
             */
            groupByDay: function (values, dayLimit) {
                dayLimit = dayLimit || '00:00:00';

                values = values || this.values();
                return _.groupBy(values, function (resource) {
                    if (resource.start) {
                        var date = moment(resource.start),
                            dayBorderMoment = moment(dayLimit, 'HH:mm:ss');

                        // if startTime is before dayLimit the event counts to previous day #47
                        if(date.hour() < dayBorderMoment.hour()||
                            (date.hour() === dayBorderMoment.hour() && date.minute()<dayBorderMoment.minute()) ||
                            (date.hour() === dayBorderMoment.hour() &&
                            date.minute() === dayBorderMoment.minute() &&
                            date.second() < dayBorderMoment.second()) ){
                            // should be count for previous day
                            return moment(date).subtract(1,'day').startOf('day').format();
                        }

                        return moment(resource.start).startOf('day').format();
                    }
                    return 'unknown';
                });
            },

            /**
             * removes any item from list that is not yet published
             * if no published date is defined for an item the item is retained in list.
             * @param values
             * @returns {Resource}
             */
            filterNotPublished: function(values){
                values = values || this.values();
                var data = filterNonPublishedFilter(values);
                var result =  new Resource();
                angular.forEach(data,function(entry){
                    result[entry.id] = entry;
                });
                return result;
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
                var categories = cat;
                if( !angular.isArray(categories) ){
                    categories = [];
                    categories.push(cat);
                }
                return _.filter(this.values(), function (resource) {
                    if (!resource.eventCategory) { return false; }
                    if (categories.indexOf(resource.eventCategory) !== -1) {
                        return !exclude;
                    }
                    return exclude;
                });

            }

        };

        return Resource;
    });
