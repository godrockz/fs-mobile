'use strict';
angular.module('fsMobile.controllers', []).config(function ($stateProvider) {
    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        resolve:{
            appData:function(dataProvider, $rootScope){
                return dataProvider.updateData().then(function(){
                    return dataProvider.getAppDataRo();
                }).finally(function(){
                    $rootScope.$broadcast('scroll.refreshComplete');
                });
            }
        },
        controller:function($scope,appData, dataProvider){
            $scope.refreshData = function(){
                return dataProvider.updateData().then(function(){
                    return dataProvider.getAppDataRo();
                }).finally(function(){
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
        }
    });
});

