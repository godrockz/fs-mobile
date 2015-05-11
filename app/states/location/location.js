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
                controller: function () {
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

                    if ($scope.appData.locations){
                        $scope.location = $scope.appData.locations[$stateParams.idx];
                    }

                    $scope.$watch('resources.locations',function() {
                        if($scope.appData.locations) {
                            $scope.location = $scope.appData.locations[$stateParams.idx];
                        }
                    });
                }
            }
        }
    });
});
