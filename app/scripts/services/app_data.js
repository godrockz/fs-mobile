/*global
    angular, moment
*/

'use strict';
angular.module('fsMobile.services')
    .factory('AppData', function (Resource, $filter, ImageCacheService, ImgCache, debug) {

        /**
         * events before this time are counted to the previous day
         * In result
         * an event starting 31.08. 23:00 and
         * an event starting 01.09. 01:00 are both displayed at 31.08. because the time of second event
         * is before the dayLimit.
         * @type {string}
         */
        var dayLimit='05:59:59';

        function testCache(uri,scope){
            // TODO: verify caching with different base urls
            var u1 = 'http://spektacholeriker.de:8080/' + uri; // ... / url
            var u2 = 'http://fs.spektacholeriker.de:8080/' + uri; // .. / url
            //ImgCache.isCached(url)
            //ImgCache.cacheFile(url)

           ImgCache.cacheFile(u1,function(){
               console.log('cache1 done');
               ImgCache.isCached(u1,function(url1, isCached1){
                   console.log('isCached1',url1, isCached1);
                   ImgCache.isCached(u2,function(url2,isCached2){
                       console.log('isCached2',url2,isCached2);
                       debug.addData('scope: '+scope+' bothBaseUrisCache','check that '+u1+
                           ' and '+ u2 + ' is cached: results',{ u1:isCached1, u2:isCached2 });
                   });
               });
           },function(){
               console.log('ERR CACHING FILE ', u1);
           });
        }

        function cacheIfNeeded(url){
            // TODO: check how to remove unused images
            // TODO: linearize .. no DOS attack fetches
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
                testCache(uri,'news');
            }

            this.program = [];
            this.workshops = [];
            var uri;
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
                    loc.days = [];
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
            testCache(uri,'events');
        }

        return AppData;
    });
