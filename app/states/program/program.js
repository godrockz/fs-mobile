/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.program', {
        url: '/program',
        views: {
            'menuContent': {
                templateUrl: 'states/program/program.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate) {

                    $ionicSideMenuDelegate.canDragContent(false);

                    $scope.currentEvents = [];
                    $scope.watching = { currentDateTime: new Date('2015-07-29T10:20') };
                    $scope.$watch('watching.currentDateTime',function(time){
                         $scope.currentEvents =
                             $scope.appData.events.filterByTime(time)
                    });

                    $scope.tabNames = [
                        'Mainstageeeeee','Hauptbühneeeeeeeeeeeeeeeeeeeeeeee','Nebenbühneeeeee','Weitere Bühneeeeee','Letzte Bühneeeeee'
                    ];
                    $scope.tabIndex = 0;

                    $scope.changeTabHeadTo = function(index){
                        $scope.tabIndex = index;
                        console.log('index',$scope.tabNames[$scope.tabIndex]);
                    };

                    $scope.next = function() {
                        $ionicSlideBoxDelegate.next();
                    };
                    $scope.previous = function() {
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
                templateUrl: 'states/program/program.html',
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
