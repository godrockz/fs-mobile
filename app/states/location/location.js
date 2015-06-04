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
                controller: function ($scope, $ionicSideMenuDelegate) {

                    $ionicSideMenuDelegate.canDragContent(false);

                    $scope.data = [
                        {   title: 'Konzert 1',
                            typ: 'CONCERT',
                            date: '2015.08.01 - 20:00',
                            location: 'Mainstage',
                            text: 'Dies ist ein freier Text der das Event, in diesem Fall das Konzert 1 beschreibt.',
                            genre: 'Post-Punk'
                        },
                        {   title: 'Konzert 2',
                            typ: 'CONCERT',
                            date: '2015.07.30 - 18:30',
                            location: 'Kunstzelt',
                            text: 'Dies ist ein freier Text der das Event, in diesem Fall das Konzert 2 beschreibt.',
                            genre: 'Post-Punk'
                        },
                        {   title: 'Seminar A',
                            typ: 'SEMINAR',
                            date: '2015.08.01 - 14:00',
                            location: 'Mainstage',
                            text: 'Dies ist ein freier Text der das Event, in diesem Fall das Seminar A beschreibt.'
                        }
                    ];

                    console.log('$scope.appData',$scope.data);

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
