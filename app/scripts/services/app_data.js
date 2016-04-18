/*global
    angular, moment
*/

'use strict';
angular.module('fsMobile.services')
    .factory('AppData', function (Resource, $filter, ImageCacheService) {

        /**
         * events before this time are counted to the previous day
         * In result
         * an event starting 31.08. 23:00 and
         * an event starting 01.09. 01:00 are both displayed at 31.08. because the time of second event
         * is before the dayLimit.
         * @type {string}
         */
        var dayLimit='05:59:59';

        function BY_EVENT_START(a,b){
            return moment(a.start).diff(moment(b.start));
        }

        function cacheIfNeeded(url){
            ImageCacheService.isCached(url).then(function(isCached){
                if(!isCached){
                    ImageCacheService.cacheImage(url);
                }
            });
        }

        function AppData(data) {
            var self = this;
            this.$metaInfo = data.$metaInfo;
            angular.forEach(data, function (value, key) {
                this[key] = (key === '$metaInfo') ? value : new Resource(value);
            }.bind(this));

            // filter unpublished locations
            this.locations = this.locations || new Resource({});
            this.locations = this.locations.filterNotPublished();

            this.fsNews = [];
            if (this.news) {
                this.fsNews = $filter('filter')(this.news.values(), {deleted: false});
                this.fsNews = $filter('filterNonPublished')(this.fsNews); // do never show content that is not yet published
                this.fsNews = $filter('orderObjectBy')(
                    this.fsNews, 'publishDate', 'date', 'desc');

                var uri;
                angular.forEach(this.fsNews,function(news){
                    cacheIfNeeded(news.image);
                    if(!uri){
                        uri = news.image;
                    }
                });
                //testCache(uri,'news');
            }

            this.program = [];
            this.workshops = [];
            if (this.events) {
                // attach locations to published events
                this.events = this.events.filterNotPublished();
                angular.forEach(this.events,function(event){
                    event.location = self.locations[event.locationRef];

                    // pre-render tags string to avoid ng-repeat for every event
                    event.tagString = {};
                    angular.forEach(event.translations,function(values,lang){
                        var data = event.translations[lang].tags;
                        if(data){
                            event.tagString[lang] =
                                (!data || data.length<=0) ? '': '#' + data.join(' #');
                        }
                    });


                    angular.forEach(event.images,function(url){
                        cacheIfNeeded(url);
                        if(!uri){
                            uri = url;
                        }
                    });

                });

                // BUILD PROGRAM
                var programEvents = this.events.filterByEventCategory('WORKSHOP', true);
                programEvents = this.events.groupByLocation(programEvents);


                angular.forEach(programEvents, function(locationEvents, locationId) {
                    var loc = this.locations[locationId];
                    // we should not create dummy locations for unassigned events!
                    if (!loc){ return; }

                    loc.events = [];
                    loc.days = []; // is this still required ?

                    // link them to allow next/previous navigation via swipe in detail views
                    var prevEvent;
                    var sorted = locationEvents.sort(BY_EVENT_START);

                    angular.forEach(sorted,function(evt){
                        if(prevEvent){
                            prevEvent.$nextEvent = evt;
                            evt.$previousEvent = prevEvent;
                        }
                        prevEvent = evt;
                        loc.events.push(evt);
                    });

                    // TODO: ist grouped by day still required ?
                    angular.forEach(this.events.groupByDay(locationEvents, dayLimit),
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
                workshopEvents = this.events.filterNotPublished(workshopEvents);

                workshopEvents = this.events.groupByDay(workshopEvents);

                angular.forEach(workshopEvents, function (dayEvents, dayString) {
                    var day = {
                        date: moment(dayString),
                        events: dayEvents
                    };

                    // link them to allow next/previous navigation via swipe in detail views
                    var prevEvent;
                    var sorted = dayEvents.sort(BY_EVENT_START);
                    angular.forEach(sorted,function(evt){
                        if(prevEvent){
                            prevEvent.$nextEvent = evt;
                            evt.$previousEvent = prevEvent;
                        }
                        prevEvent = evt;
                    });

                    day.day_name = day.date.format('dddd').toLowerCase();
                    this.workshops.push(day);
                }, this);

                this.workshops = $filter('orderObjectBy')(this.workshops, 'date', 'date');
            }
        }

        return AppData;
    });
