/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.locations', {
        url: '/locations',
        views: {
            'menuContent': {
                templateUrl: 'states/location/locations.html',
                controller: function ($state, $scope ) {

                    $scope.$watch('resources.index',function(){
                        if($scope.resources.index){
                            $scope.resources.index.$load.locations().then(function(locations){
                                console.log('got locations',locations);
                                $scope.locations = locations;
                                $scope.resources.locations = locations;
                            });
                        }
                    });

                }
            }
        }
    });

    $stateProvider.state('app.location', {
        url: '/location/:idx',
        views: {
            'menuContent': {
                templateUrl: 'states/location/location.html',
                controller: function ($scope, $stateParams) {

                    if($scope.resources.locations){
                        $scope.location= $scope.resources.locations[$stateParams.idx];
                    }

                    $scope.$watch('resources.locations',function(){
                        if($scope.resources.locations){
                            $scope.location = $scope.resources.locations[$stateParams.idx];
                        }
                    });
                }
            }
        }
    });
});
