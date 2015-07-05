/*jslint
  plusplus: true
*/
/*global
    angular, moment
*/

'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.program', {
        url: '/program/all/:locationId',
        views: {
            'menuContent': {
                templateUrl: 'states/program/program.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $stateParams) {

                    var newLocations = [],
                        actualEvent = null;

                    $ionicSideMenuDelegate.canDragContent(false);

                    $scope.currentDateTime = new Date('2015-07-29T10:20');

                    $scope.events = $scope.appData.events;
                    $scope.locations = $scope.appData.locations;

                    // Events nach Location sortieren
                    $scope.eventsGroupLoc = $scope.events.groupByLocation();

                    // Events mit bestimmten Kategorien zu einer Location hinzufügen
                    $scope.eventsOutput = null;

                    // map to allow jumpt to slides by locationIds without further foreach
                    var locationSlideIndexMap = {};

                    angular.forEach($scope.eventsGroupLoc, function (locationEvents, locationId) {

                        if(!$scope.locations[locationId]){
                            return; // we should not create dummy locations for unassigned events ?
                        }
                        var newlocation = {};
                        newlocation.id = locationId;
                        if (locationId === 'unknown') {
                            newlocation.name = 'unknown';
                        } else {
                            newlocation.translations = $scope.locations[locationId].translations;
                        }

                        newlocation.events = {
                            'wednesday': {index: 0, date: moment('29.07.2015','DD.MM.YYYY'), events: []},
                            'thursday': {index: 1, date: moment('30.07.2015','DD.MM.YYYY'), events: []},
                            'friday': {index: 2, date: moment('31.07.2015','DD.MM.YYYY'), events: []},
                            'saturday': {index: 3, date: moment('01.08.2015','DD.MM.YYYY'), events: []},
                            'sunday': {index: 4, date: moment('02.08.2015','DD.MM.YYYY'), events: []}
                        };

                        // Alle Events der Location auslesen und hinzufügen wenn richtige Kategorie
                        newlocation.eventCount = 0;
                        angular.forEach(locationEvents, function (event) {

                            if (event.eventCategory !== 'WORKSHOP') {
                                var day = moment(event.start).format('dddd').toLowerCase(),
                                    eStart = new Date(event.start),
                                    eEnd = new Date(event.end),
                                    aEnd = null;

                                if (actualEvent === null) {
                                    actualEvent = event.id;
                                } else {
                                    aEnd = new Date(actualEvent.end);

                                    if ($scope.currentDateTime >= eStart && $scope.currentDateTime <= eEnd) {
                                        actualEvent = event.id;
                                    } else if ($scope.currentDateTime < eEnd && $scope.currentDateTime > aEnd) {
                                        actualEvent = event.id;
                                    } else if ($scope.currentDateTime < eStart) {
                                        actualEvent = event.id;
                                    }
                                }

                                newlocation.events[day].events.push(event);
                                newlocation.eventCount++;
                            }
                        });

                        newlocation.actualEvent = actualEvent;
                        if (newlocation.eventCount > 0) { // only put locations that have events
                            var idx = newLocations.length;
                            newLocations.push(newlocation);
                            locationSlideIndexMap[locationId]=idx;
                        }
                    });
                    $scope.eventsOutput = newLocations;
                    console.log('$scope.eventsOutput', $scope.eventsOutput);

                    $scope.tabIndex = 0;
                    $scope.changeTabHeadTo = function (index) {
                        $scope.tabIndex = index;
                    };

                    $scope.next = function () {
                        $ionicSlideBoxDelegate.next();
                    };

                    $scope.previous = function () {
                        $ionicSlideBoxDelegate.previous();
                    };

                    $scope.active={slide:undefined};
                    function slideTo(locationId) {
                        // first find the index of slides that contains the location
                        if (!angular.isDefined(locationSlideIndexMap[locationId])) {
                            return;
                            // we do not have any location with this id so it mus be a workshop type
                            // for workshops we cannot jump in location based so we can't do anything here
                            // except we implement hidden workshop locations or something like this
                        }
                        var idx = locationSlideIndexMap[locationId];
                        console.log('slide to found ', idx);
                        $scope.changeTabHeadTo(idx);
                        $scope.active.slide = idx;

                    }

                    // jump to location if requested by param
                    if($stateParams.locationId){
                        slideTo($stateParams.locationId);
                    }

                }
            }
        }
    });

    $stateProvider.state('app.singleprogram', {
        url: '/program/:idx',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'states/program/singleprogram.html',
                controller: function ($scope, $stateParams) {

                    if ($scope.appData.events) {
                        $scope.event = $scope.appData.events[$stateParams.idx];
                        $scope.event.location = $scope.appData.locations[$scope.event.locationRef];
                    }
                    console.log('$scope.event', $scope.event);

                }
            }
        }
    });
});
