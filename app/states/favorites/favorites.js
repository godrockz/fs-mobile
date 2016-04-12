/**
 * showing up events selected as favorites
 * <p/>
 * Created by Benjamin Jacob on 07.04.16.
 * <p/>
 */
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {

    /**
     * time function:
     * if the test is between start and end. (inclusive match)
     * wheras moment.isBetween is exclusive
     * @param test - a moment
     * @param start - a moment
     * @param end - a moment
     */
    function isBetween(test, start, end) {
        return (test.isAfter(start) ) && (test.isBefore(end) );//|| test.isSame(end) /|| test.isSame(start)
    }

    /**
     *
     * @param height -
     * @param removeEmptyRows - remove rows without events
     * @param additionalSteps - add amount of steps to end of the list (allow scroll)
     * @param onRemovalKeepStepsBetween keep amount steps after an event (only if removeEmptySteps is set tot true)
     * @param renderAllTimes default:false, if true every step gets its time information rendered
     * @param showFullGrid - show gridlines on whole screen, default true
     * @constructor
     */
    function CalendarGrid(height, removeEmptyRows, additionalSteps, onRemovalKeepStepsBetween, renderAllTimes, useAbsoluteRendering, showFullGrid) {
        this.useAbsoluteRendering = useAbsoluteRendering === undefined ? true : useAbsoluteRendering;
        this.showFullGrid = showFullGrid === undefined ? true : showFullGrid;
        this.events = [];
        this.firstTime = moment();
        this.lastTime = moment(0);
        this.locations = {};
        this.entryHeight = height || 100; // px
        this.entryWidth = 90; //percentage
        this.removeEmptyRows = removeEmptyRows === undefined ? true : removeEmptyRows;
        this.additionalSteps = additionalSteps || 0;
        this.onRemovalKeepStepsBetween = onRemovalKeepStepsBetween || 0;
        this.showAllTimes = renderAllTimes === undefined ? false : renderAllTimes;
        this.locationCount = 0;
    }

    CalendarGrid.prototype.addEvent = function (event) {
        // add to list of events
        // update minStart max End
        // add location if not yet exists
        this.locations[event.location.id] = event.location;
        this.locationCount = Object.keys(this.locations).length;
        this.entryWidth = 99 / (this.locationCount + 1 );// +1 to mind the time column


        var start = moment(event.start), end = moment(event.end);

        if (this.firstTime.isAfter(start)) {
            this.firstTime = start;
        }
        if (this.lastTime.isBefore(end)) {
            this.lastTime = end;
        }
        this.events.push(event);

    };


    CalendarGrid.prototype.addWorkshopEvent = function (event) {
        // all ws events should be displayed @ same location so wrap it.
        var newEvent = angular.copy(event, {});
        newEvent.location = {id: 'workshop', originalLocation: event.location};
        this.addEvent(newEvent);
    };

    CalendarGrid.prototype.getEventsFor = function (startTime, endTime) {
        var result = [];
        angular.forEach(this.events, function (event) {
            var start = moment(event.start),
                end = moment(event.end);
            if (isBetween(startTime, start, end) || isBetween(endTime, start, end)) {
                result.push(event);
            }
        });
        return result;
    };

    CalendarGrid.prototype.getTimeLine = function (stepSizeMin) {
        var me = this,
            step = parseInt(stepSizeMin, 10) || 15,
            currentTime = this.firstTime,
            result = [], cnt = 1000,
            endTime = this.additionalSteps ? moment(this.lastTime).add(this.additionalSteps * stepSizeMin, 'MINUTE') : this.lastTime,
            keeptStepCnt = 0,
            addedEvents = {};

        while (currentTime.isBefore(endTime) || cnt <= 0) {
            var nextTime = moment(currentTime).add(step, 'MINUTE'),
                eventsToAdd = this.getEventsFor(currentTime, nextTime),
                isAdditionalTime = currentTime.isAfter(this.lastTime);

            if (eventsToAdd.length <= 0 && this.removeEmptyRows) {

                if (keeptStepCnt >= this.onRemovalKeepStepsBetween && !isAdditionalTime) {
                    currentTime = nextTime;
                    cnt--; // avoid endless loops
                    continue;
                }
                keeptStepCnt++;

            }
            if (this.removeEmptyRows && eventsToAdd.length > 0) {
                // reset keept step cnt
                keeptStepCnt = 0;
            }
            var locations = {};
            /* jshint -W083 */
            angular.forEach(this.locations, function (loc) {
                locations[loc.id] = {
                    location: loc,
                    events: []
                };
            });

            /* jshint -W083 */
            angular.forEach(eventsToAdd, function (event) {

                var location = locations[event.location.id];

                if (!location) {
                    throw 'no locationContainer found';
                }

                if (!addedEvents[event.id]) {
                    // this is the first event getting added
                    var durationInMinutes = moment.duration(moment(event.end).diff(moment(event.start))).asMinutes();
                    var renderHeight = Math.ceil(durationInMinutes / stepSizeMin) * me.entryHeight;
                    if (location.renderHeight === undefined || location.renderHeight < renderHeight) {
                        location.renderHeight = renderHeight;
                    }
                }

                location.events.push(event);
                addedEvents[event.id] = event;
            });


            result.push({
                time: currentTime.toDate(),
                isFullHour: currentTime.minute() === 0,
                locations: locations
            });

            currentTime = nextTime;
            cnt--; // avoid endless loops
        }
        // create grid starting @ start
        return result;
    };

    $stateProvider.state('app.favorites', {
        url: '/favorites',
        views: {
            'menuContent': {
                templateUrl: 'states/favorites/favorites-list.html',

                controller: function ($scope) {
                    var removeEmptyBlocks = true,
                        cellHeight = 30,
                        slotSizeInMinutes = 15,
                        additionalSteps = 6,
                        keeptStepCnt = 2,
                        renderTimeEachStep = false,
                        useAbsoluteRendering = true,
                        showFullGrid = true;


                    var grid = new CalendarGrid(cellHeight, removeEmptyBlocks, additionalSteps, keeptStepCnt, renderTimeEachStep, useAbsoluteRendering, showFullGrid);

                    // FAVORITE EVENTS
                    angular.forEach($scope.appData.program, function (location) {
                        angular.forEach(location.days, function (day) {
                            angular.forEach(day.events, function (event) {
                                if (event.liked && event.liked === true) {
                                    grid.addEvent(event);
                                }
                            });
                        });
                    });


                    // FAVORITE WORKSHOPS
                    angular.forEach($scope.appData.workshops, function (day) {
                        angular.forEach(day.events, function (event) {
                            if (event.liked && event.liked === true) {
                                grid.addWorkshopEvent(event);
                            }
                        });
                    });


                    // ### LOCATION SELECTION
                    function log() {
                        console.log('idx', $scope.selectedEventIdx, 'event',
                            $scope.selectedLocationCt.events[$scope.selectedEventIdx]);
                    }

                    $scope.selectLocation = function (locationCt) {
                        $scope.selectedLocationCt = locationCt;
                        $scope.selectedEventIdx = 0;
                        $scope.selectedEvent = $scope.selectedLocationCt.events[$scope.selectedEventIdx];
                        log();
                    };
                    $scope.nextEvent = function () {
                        var nextIdx = $scope.selectedEventIdx + 1;
                        $scope.selectedEventIdx = nextIdx >= $scope.selectedLocationCt.events.length ? 0 : nextIdx;
                        $scope.selectedEvent = $scope.selectedLocationCt.events[$scope.selectedEventIdx];
                        log();
                    };
                    $scope.previousEvent = function () {
                        var nextIdx = $scope.selectedEventIdx - 1;
                        $scope.selectedEventIdx = nextIdx < 0 ? $scope.selectedLocationCt.events.length - 1 : nextIdx;
                        $scope.selectedEvent = $scope.selectedLocationCt.events[$scope.selectedEventIdx];

                        log();
                    };
                    $scope.closeLocation = function () {
                        delete $scope.selectedLocationCt;
                    };


                    // RESULTS TO SCOPE
                    $scope.timeline = grid.getTimeLine(slotSizeInMinutes);
                    $scope.grid = grid;
                }
            }


        }
    });
});
