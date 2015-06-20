/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.workshops', {
        url: '/workshops',
        views: {
            'menuContent': {
                templateUrl: 'states/workshops/workshops.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {

                    $ionicSideMenuDelegate.canDragContent(false);

                    $scope.groupedEvents = $scope.appData.events.groupByDay();

                    var days = _.keys($scope.groupedEvents);
                    var tabIndex = 0;

                    $scope.changeTabHeadTo = function(index){
                        tabIndex = index;
                        console.log('index',$scope.tabNames[tabIndex]);
                    };

                    $scope.nextTab = function() {
                        $ionicSlideBoxDelegate.next();
                    };
                    $scope.previousTab = function() {
                        $ionicSlideBoxDelegate.previous();
                    };


                    $scope.previousDay = function() {
                        var index = tabIndex ? tabIndex-1 : days.length-1
                        return days[index]
                    };

                    $scope.nextDay = function() {
                        var index = tabIndex === days.length ? 0 : tabIndex+1
                        return days[index]
                    };

                    $scope.currentDay = function() {
                        return days[tabIndex]
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

                    if($scope.resources.events){
                        $scope.event= $scope.resources.events[$stateParams.idx];
                    }

                    $scope.$watch('resources.events',function(){
                        if($scope.resources.events){
                            $scope.event = $scope.resources.events[$stateParams.idx];
                        }
                    });
                }
            }
        }
    });
});
