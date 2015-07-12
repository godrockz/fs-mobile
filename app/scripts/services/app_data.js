/*global
    angular, moment
*/

'use strict';
angular.module('fsMobile.services')
    .factory('AppData', function (Resource, $filter) {

        function AppData(data) {
            angular.forEach(data, function (value, key) {
                this[key] = (key === '$metaInfo') ? value : new Resource(value);
            }.bind(this));

            this.locations = this.locations || {};

            this.fsNews = [];
            if (this.news) {
                this.fsNews = $filter('filter')(this.news.values(), {deleted: false});
                this.fsNews = $filter('orderObjectBy')(
                    this.fsNews, 'publishDate', 'date', 'desc');
            }

            this.program = [];
            this.workshops = [];
            if (this.events) {
                // groups evens by location for program
                var programEvents = this.events.filterByEventCategory('WORKSHOP', true);
                programEvents = this.events.groupByLocation(programEvents);

                angular.forEach(programEvents, function(locationEvents, locationId) {
                    var loc = this.locations[locationId];
                    // we should not create dummy locations for unassigned events ?
                    if (!loc){ return; }
                    loc.days = [];
                    angular.forEach(this.events.groupByDay(locationEvents),
                                    function(dayEvents, dayString) {
                        var day = {
                            date: moment(dayString),
                            events: dayEvents
                        };
                        loc.days.push(day);
                    });
                    this.program.push(loc);
                }, this);

                // groups workshops by days
                var workshopEvents = this.events.filterByEventCategory('WORKSHOP');
                workshopEvents = this.events.groupByDay(workshopEvents);

                angular.forEach(workshopEvents, function (dayEvents, dayString) {
                    var day = {
                        date: moment(dayString),
                        events: dayEvents
                    };
                    day.day_name = day.date.format('dddd').toLowerCase();
                    this.workshops.push(day);
                }, this);
            }
        }

        return AppData;
    });
