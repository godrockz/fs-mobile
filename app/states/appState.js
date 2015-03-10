'use strict';
angular.module('fsMobile.controllers', []).config(function ($stateProvider) {
    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: function ($scope, dataProvider, ENV) {

            $scope.resources = {
                refreshData:function(){
                    dataProvider.fetch(ENV.apiEndpoint).then(function (index) {
                        console.log('index', index);
                        $scope.resources.index = index;
                    }).finally(function(){
                        $scope.$broadcast('scroll.refreshComplete');
                    });
                }
            };
            $scope.resources.refreshData();
        }
    });
});

