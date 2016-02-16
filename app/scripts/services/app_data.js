/*global
    angular, moment
*/

'use strict';
angular.module('fsMobile.services')
    .factory('AppData', function (Resource, $filter) {

        function AppData(data) {
            var self = this;
            this.$metaInfo = data.$metaInfo;
            angular.forEach(data, function (value, key) {
                this[key] = (key === '$metaInfo') ? value : new Resource(value);
            }.bind(this));

            // filter unpublished locations
            this.locations = this.locations || {};
            this.locations = this.locations.filterNotPublished();

            this.fsNews = [];
            if (this.news) {
                this.fsNews = $filter('filter')(this.news.values(), {deleted: false});
                this.fsNews = $filter('filterNonPublished')(this.fsNews); // do never show content that is not yet published
                this.fsNews = $filter('orderObjectBy')(
                    this.fsNews, 'publishDate', 'date', 'desc');
            }

            this.program = [];
            this.workshops = [];
            if (this.events) {
                // attach locations to published events
                this.events = this.events.filterNotPublished();
                angular.forEach(this.events,function(event){
                    event.location = self.locations[event.locationRef];
                });

                // BUILD PROGRAM
                var programEvents = this.events.filterByEventCategory('WORKSHOP', true);
                programEvents = this.events.groupByLocation(programEvents);

                angular.forEach(programEvents, function(locationEvents, locationId) {
                    var loc = this.locations[locationId];
                    // we should not create dummy locations for unassigned events!
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
                    // need to sort the days
                    loc.days = $filter('orderObjectBy')(loc.days,'date','date');
                    this.program.push(loc);
                }, this);

                // BUILD WORKSHOPS
                // groups workshops by days / filter unpublished / filter workshop types
                var workshopEvents = this.events.filterByEventCategory('WORKSHOP');
                workshopEvents =this.events.filterNotPublished(workshopEvents);
                workshopEvents = this.events.groupByDay(workshopEvents);

                angular.forEach(workshopEvents, function (dayEvents, dayString) {
                    var day = {
                        date: moment(dayString),
                        events: dayEvents
                    };
                    day.day_name = day.date.format('dddd').toLowerCase();
                    this.workshops.push(day);
                }, this);

                this.workshops = $filter('orderObjectBy')(this.workshops, 'date', 'date');
            }
        }

        return AppData;
    });
