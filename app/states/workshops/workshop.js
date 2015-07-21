/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */

/*global
    angular
*/

'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.workshops', {
        url: '/workshops',
        views: {
            'menuContent': {
                templateUrl: 'states/workshops/workshops.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {
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
                        var day = $scope.appData.workshops[$scope.tabIndex - 1];
                        return day? day.day_name : undefined;
                    };

                    $scope.nextDay = function () {
                        var day = $scope.appData.workshops[$scope.tabIndex + 1];
                        return day? day.day_name : undefined;
                    };

                    $scope.currentDay = function () {
                        var day =  $scope.appData.workshops[$scope.tabIndex];
                        return day? day.day_name : undefined;
                    };

                    // only render prev, current and next slide
                    $scope.showSlide = function (index) {
                        return index === $scope.tabIndex-1 ||
                               index === $scope.tabIndex ||
                               index === $scope.tabIndex+1;
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
