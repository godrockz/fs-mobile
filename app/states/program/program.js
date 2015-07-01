/*jslint
  plusplus: true
*/
/*global
    angular, moment
*/

'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.program', {
        url: '/program',
        views: {
            'menuContent': {
                templateUrl: 'states/program/program.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {

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

                    angular.forEach($scope.eventsGroupLoc, function (locationEvents, locationId) {

                        var newlocation = [];
                        newlocation.id = locationId;
                        if (locationId === 'unknown') {
                            newlocation.name = 'unknown';
                        } else {
                            newlocation.translations = $scope.locations[locationId].translations;
                        }
                        newlocation.events = {
                            'wednesday': {index: 0, events: []},
                            'thursday': {index: 1, events: []},
                            'friday': {index: 2, events: []},
                            'saturday': {index: 3, events: []},
                            'sunday': {index: 4, events: []}
                        };

                        // Alle Events der Location auslesen und hinzufügen wenn richtige Kategorie
                        newlocation.eventCount = 0;
                        angular.forEach(locationEvents, function (event) {
                            if (event.eventCategory === 'CONCERT') {
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
                        if (newlocation.eventCount > 0) {
                            newLocations.push(newlocation);
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
                    }
                    console.log('$scope.event', $scope.event);

                }
            }
        }
    });
});
