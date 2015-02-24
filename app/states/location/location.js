/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.locations', {
        url: '/locations',
        views: {
            'menuContent': {
                templateUrl: 'states/location/locations.html',
                controller: function ($state, $scope, RestClient, ENV) {
                    console.log('state init');
                    $scope.data = 'Loading from ' + ENV.apiEndpoint;

                    RestClient.load(ENV.apiEndpoint).then(function (data) {
                        $scope.data = data;
                    });

                    $scope.locations = [{id:1, name:'Mainstage'},{id:2,name:'Kunstzelt'}];
                }
            }
        }
    });


    $stateProvider.state('app.location', {
        url: '/location/:id',
        views: {
            'menuContent': {
                templateUrl: 'states/location/location.html',
                controller: function ($scope, $stateParams,RestClient, ENV) {
                    $scope.data = 'Loading from ' + ENV.apiEndpoint;

                    RestClient.load(ENV.apiEndpoint).then(function (data) {
                        $scope.data = data;
                    });

                    $scope.locations = [{id:1, name:'Mainstage'},{id:2,name:'Kunstzelt'}];
                    $scope.location = $scope.locations[$stateParams.id];
                }
            }
        }
    });
});
