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
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $filter) {
                    var workshops_length = $scope.appData.workshops.length;

                    $scope.tabIndex = 0;

                    $ionicSideMenuDelegate.canDragContent(false);

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
                        var day = $scope.appData.workshops[$scope.tabIndex - 1] || {};
                        return day.day_name;
                    };

                    $scope.nextDay = function () {
                        var day = $scope.appData.workshops[$scope.tabIndex + 1] || {};
                        return day.day_name;
                    };

                    $scope.currentDay = function () {
                        return $scope.appData.workshops[$scope.tabIndex].day_name;
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

                    if ($scope.appData.events) {
                        $scope.event = $scope.appData.events[$stateParams.idx];
                        $scope.event.location = $scope.appData.locations[$scope.event.locationRef];
                    }
                }
            }
        }
    });
});
