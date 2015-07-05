/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */

/*jslint
  nomen: true
*/
/*global
    angular, moment, _
*/

'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.workshops', {
        url: '/workshops',
        views: {
            'menuContent': {
                templateUrl: 'states/workshops/workshops.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $filter, Resource) {

                    $scope.tabIndex = 0;
                    var days = [];

                    $ionicSideMenuDelegate.canDragContent(false);

                    // Get the Workshops from Events-Resource
                    if (!$scope.appData.workshops && $scope.appData.events) {
                        $scope.appData.workshops = new Resource(
                            $scope.appData.events.filterByEventCategory('WORKSHOP')
                        );
                    }

                    // Group Workshops by Day
                    $scope.groupedEvents = {};
                    if ($scope.appData.workshops) {
                        $scope.groupedEvents = $scope.appData.workshops.groupByDay();
                    }

                    // Sort days
                    days = _.keys($scope.groupedEvents);
                    var day_of_week = $filter('lowercase')(moment().format('e'));
                    //console.log('day_of_week',day_of_week);
                    var list = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
                    var sorted_list = list.slice(day_of_week).concat(list.slice(0,day_of_week));
                    //console.log('sorted_list',list.slice(day_of_week.toString));
                    days.sort(function(a,b) { return sorted_list.indexOf(a) > sorted_list.indexOf(b); });

                    var fsDays = {
                        'wednesday': {index: 0, date: moment('29.07.2015','DD.MM.YYYY'), events: []},
                        'thursday': {index: 1, date: moment('30.07.2015','DD.MM.YYYY'), events: []},
                        'friday': {index: 2, date: moment('31.07.2015','DD.MM.YYYY'), events: []},
                        'saturday': {index: 3, date: moment('01.08.2015','DD.MM.YYYY'), events: []},
                        'sunday': {index: 4, date: moment('02.08.2015','DD.MM.YYYY'), events: []}
                    };

                    var groupedEventsSize = Object.keys($scope.groupedEvents);

                    for(var x = 0 ; x < groupedEventsSize.length ; x++){
                        fsDays[groupedEventsSize[x]].events = $scope.groupedEvents[groupedEventsSize[x]];
                    }

                    $scope.changeTabHeadTo = function (index) {
                        $scope.tabIndex = index;
                    };

                    $scope.nextTab = function () {
                        $ionicSlideBoxDelegate.next();
                    };
                    $scope.previousTab = function () {
                        $ionicSlideBoxDelegate.previous();
                    };

                    $scope.previousDay = function () {
                        var index = $scope.tabIndex ? $scope.tabIndex - 1 : days.length - 1;
                        return days[index];
                    };

                    $scope.nextDay = function () {
                        var index = $scope.tabIndex === days.length - 1 ? 0 : $scope.tabIndex + 1;
                        return days[index];
                    };

                    $scope.currentDay = function () {
                        return days[$scope.tabIndex];
                    };

                }
            }
        }
    });

    $stateProvider.state('app.workshop', {
        url: '/workshop/:idx',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'states/workshops/workshop.html',
                controller: function ($scope, $stateParams) {

                    if ($scope.resources.events) {
                        $scope.event = $scope.appData.events[$stateParams.idx];
                    }

                    $scope.$watch('resources.events', function () {
                        if ($scope.appData.events) {
                            $scope.event = $scope.appData.events[$stateParams.idx];
                        }
                    });
                }
            }
        }
    });
});
