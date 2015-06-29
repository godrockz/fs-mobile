/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */

/*jslint
  nomen: true
*/
/*global
    angular, _
*/

'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.workshops', {
        url: '/workshops',
        views: {
            'menuContent': {
                templateUrl: 'states/workshops/workshops.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, Resource) {

                    var tabIndex = 0,
                        days = [];

                    $ionicSideMenuDelegate.canDragContent(false);

                    if (!$scope.appData.workshops && $scope.appData.events) {
                        $scope.appData.workshops = new Resource(
                            $scope.appData.events.filterByEventCategory('WORKSHOP')
                        );
                    }

                    $scope.groupedEvents = {};
                    if ($scope.appData.workshops) {
                        $scope.groupedEvents = $scope.appData.workshops.groupByDay();
                    }

                    days = _.keys($scope.groupedEvents);

                    $scope.changeTabHeadTo = function (index) {
                        tabIndex = index;
                        console.log('index', $scope.tabNames[tabIndex]);
                    };

                    $scope.nextTab = function () {
                        $ionicSlideBoxDelegate.next();
                    };
                    $scope.previousTab = function () {
                        $ionicSlideBoxDelegate.previous();
                    };

                    $scope.previousDay = function () {
                        var index = tabIndex ? tabIndex - 1 : days.length - 1;
                        return days[index];
                    };

                    $scope.nextDay = function () {
                        var index = tabIndex === days.length ? 0 : tabIndex + 1;
                        return days[index];
                    };

                    $scope.currentDay = function () {
                        return days[tabIndex];
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
