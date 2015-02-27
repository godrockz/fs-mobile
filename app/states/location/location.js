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
                controller: function ($state, $scope, RestClient, ENV, Storage) {
                    $scope.data = 'Loading from ' + ENV.apiEndpoint;
                    RestClient.load(ENV.apiEndpoint).then(function (data) {
                        $scope.data = data;
                    });

                    $scope.locations = [{id:1, name:'Mainstage'},{id:2,name:'Kunstzelt'}];

                    //
                    var store = new Storage('LOCATION');
                    store.empty().then(function() {
                        return store.add({id: 2, name: 'Mainstage', version: 1});
                    }).then(function() {
                        return store.add({id: 2, name: 'Kunstzelt', version: 2});
                    }).then(function() {
                        return store.add({id: 2, name: 'Dritter', version: 0});
                    }).then(function() {
                        return store.add({id: 2, name: 'Erster', version: 11});
                    }).then(function(){
                        return store.add({id: 3, name: 'Wiese', version: 2});
                    }).then(function(){
                        return store.get(2);
                    }).then(function(retrieved){
                        console.log('latest LOCATION by id',retrieved);
                        return store.get();
                    }).then(function(listdata){
                        $scope.locations = listdata;
                    }).then(function(){
                        return store.get(3333);
                    }).then(function(elem){
                        console.log('no data',elem);
                    });

                    var store2 = new Storage('NOTHING');
                    store2.empty();
                    store2.get().then(function(data){
                        console.log('noDataFor key',data);
                    });
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
