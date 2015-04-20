'use strict';
angular.module('fsMobile.controllers', []).config(function ($stateProvider) {
    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        resolve:{
            appData:function(dataProvider, $rootScope){
                return dataProvider.updateData().then(function(){
                    return dataProvider.getAppDataRo().then(function(data){
                        console.log(' loaded data:',data);
                        return data;
                    });
                }).finally(function(){
                    $rootScope.$broadcast('scroll.refreshComplete');
                });
            }
        },
        controller: function($scope, appData, dataProvider){
            console.log('appData in Ctrl ', appData);
            $scope.refreshData = function(){
                return dataProvider.updateData().then(function(){
                    return dataProvider.getAppDataRo().then(function(data){
                        console.log('data',data);
                        return data;
                    });
                }).finally(function(){
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
        }
    });
});

