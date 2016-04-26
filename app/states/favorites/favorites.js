/**
 * showing up events selected as favorites
 * <p/>
 * Created by Benjamin Jacob on 07.04.16.
 * <p/>
 */
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {



    $stateProvider.state('app.favorites', {
        url: '/favorites',
        views: {
            'menuContent': {
                templateUrl: 'states/favorites/favorites-list.html',

                controller: function ($scope, CalendarGrid) {
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
                        angular.forEach(location.events, function (event) {
                            if (event.liked && event.liked === true) {
                                grid.addEvent(event);
                            }

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
                    $scope.grid = grid;
                    $scope.timeline = grid.getTimeLine(slotSizeInMinutes);
                }
            }
        }
    });
    $stateProvider.state('app.now', {
        url: '/now',
        views: {
            'menuContent': {
                templateUrl: 'states/favorites/now.html',

                controller: function ($scope, CalendarGrid) {

                    var slotRangeMinutes = 40,
                        start = moment().add(slotRangeMinutes/2 * -1 ,'MINUTE'),
                        end = moment().add(slotRangeMinutes/2,'MINUTE');

                    var removeEmptyBlocks = true,
                        cellHeight = 30,
                        slotSizeInMinutes = 15,
                        additionalSteps = 6,
                        keeptStepCnt = 2,
                        renderTimeEachStep = false,
                        useAbsoluteRendering = true,
                        showFullGrid = true;

                    var grid = new CalendarGrid(cellHeight, removeEmptyBlocks, additionalSteps, keeptStepCnt,
                        renderTimeEachStep, useAbsoluteRendering, showFullGrid);

                    // select NOW events EVENTS
                    angular.forEach($scope.appData.program, function (location) {
                        angular.forEach(location.events, function (event) {

                            var eStart = event._mstart || moment(event.start),
                                eEnd = event._mstart || moment(event.end);
                            event._mstart = eStart;
                            event._mend = eEnd;

                            if(grid.isBetween(eStart, start,end) ||
                                grid.isBetween(eEnd, start, end) ||
                                    grid.isBetween( start, eStart, eEnd) ||
                                    grid.isBetween( end, eStart, eEnd)){
                                grid.addEvent(event);
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
                    $scope.grid = grid;
                    $scope.timeline = grid.getTimeLine(slotSizeInMinutes);
                }
            }
        }
    });
});

