/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
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
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {
                    var currentTime = moment();
                    $scope.view = {};

                    // sets the tabIndex to the current day
                    $scope.tabIndex = _.findIndex($scope.appData.workshops, function (ws) {
                        return currentTime.isSame(ws.date, 'day');
                    });
                    if ($scope.tabIndex < 0) { $scope.tabIndex = 0; }

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
                controller: function ($scope, $stateParams, dataProvider) {

                    if ($scope.appData.events) {
                        $scope.event = $scope.appData.events[$stateParams.idx];
                        $scope.event.location = $scope.appData.locations[$scope.event.locationRef];
                    }

                    $scope.toggleLike = function (){
                        $scope.event.liked = !$scope.event.liked;
                        dataProvider.updateSingleObject('events',$scope.event.id, $scope.event,'liked');
                    };
                }
            }
        }
    });
});
