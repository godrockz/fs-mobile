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
                controller: function (appData, $state, $scope, $translate ) {
                    $scope.locations = appData.locations;
                    $scope.currentLanguage = $translate.use().split('_')[0];
                    console.log('appData',appData.locations);
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
