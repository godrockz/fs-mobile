/*global
 angular
 */

'use strict';
angular.module('fsMobile.controllers', []).config(function ($stateProvider) {

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        resolve: {
            appData: function (dataProvider, $rootScope) {
                return dataProvider.getData().finally(function () {
                    $rootScope.$broadcast('scroll.refreshComplete');
                });
            }
        },
        controller: function ($scope, appData, dataProvider, EndpointDetector) {
            console.log('appData in Ctrl ', appData);
            $scope.appData = appData;

            var fetchData = function () {
                dataProvider.getData().then(function (data) {
                    $scope.appData = data;
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };

            $scope.deleteData = function () {
                dataProvider.deleteData();
                fetchData();
            };

            $scope.refreshData = function () {
                // alwyas discover endpoint on refresh
                EndpointDetector.discoverEndpoint().then(function () {
                    dataProvider.refreshData().then(function (data) {
                        console.log('refresh: new data saved', data);
                        fetchData();
                    });
                });

            };
        }
    });
});
