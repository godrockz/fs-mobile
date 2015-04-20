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
                controller: function ($state, $scope, Resource) {
                    $scope.currentLanguage = $translate.use().split('_')[0];
                    $scope.locations = new Resource('locations');
                }
            }
        }
    });

    $stateProvider.state('app.location', {
        url: '/location/:idx',
        views: {
            'menuContent': {
                templateUrl: 'states/location/location.html',
                controller: function ($scope, $stateParams, Resource) {

                    $scope.locations = new Resource('locations');
                    $scope.location = $scope.locations[$stateParams.idx];

                    $scope.$watch('locations',function(){
                        $scope.location = $scope.locations[$stateParams.idx];
                    });
                }
            }
        }
    });
});
