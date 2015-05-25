'use strict';
angular.module('fsMobile.controllers', []).config(function ($stateProvider) {

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        resolve:{
            appData:function(dataProvider, $rootScope){
                return dataProvider.getData().finally(function(){
                    $rootScope.$broadcast('scroll.refreshComplete');
                });
            }
        },
        controller: function($scope, appData, $translate, dataProvider){
            console.log('appData in Ctrl ', appData);
            $scope.appData = appData;

            $scope.deleteData = function(){
                dataProvider.deleteData();
                dataProvider.getData().then(function(data){
                   $scope.appData = data;
                });
            };

            $scope.refreshData = function() {
                dataProvider.refreshData().then(function(data){
                    console.log('refresh: new data saved', data);
                    angular.forEach(data, function(resource, resourceName) {
                        $scope.appData[resourceName] = resource;
                    });
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
        }
    });
});

