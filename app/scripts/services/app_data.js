/*global
    angular, moment
*/

'use strict';
angular.module('fsMobile.services')
    .factory('AppData', function (Resource) {

        function AppData(data) {
            angular.forEach(data, function (value, key) {
                this[key] = (key === '$metaInfo') ? value : new Resource(value);
            }.bind(this));

            // Events nach Location gruppieren
            this.program = [];
            if (this.events) {
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
            }
        }

        return AppData;
    });
