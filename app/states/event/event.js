/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.events', {
        url: '/events',
        views: {
            'menuContent': {
                templateUrl: 'states/event/events.html',
                controller: function ($state, $scope ) {

                    $scope.$watch('resources.index',function(){
                        if($scope.resources.index){
                            $scope.resources.index.$load.events().then(function(events){
                                console.log('got events',events);
                                $scope.events = events;
                                $scope.resources.events = events;
                            });
                        }
                    });

                }
            }
        }
    });

    $stateProvider.state('app.event', {
        url: '/event/:idx',
        views: {
            'menuContent': {
                templateUrl: 'states/event/event.html',
                controller: function ($scope, $stateParams) {

                    if($scope.resources.events){
                        $scope.event= $scope.resources.events[$stateParams.idx];
                    }

                    $scope.$watch('resources.locations',function(){
                        if($scope.resources.events){
                            $scope.event = $scope.resources.events[$stateParams.idx];
                        }
                    });
                }
            }
        }
    });
});
