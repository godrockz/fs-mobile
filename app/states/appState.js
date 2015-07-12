/*global
 angular
 */

'use strict';
angular.module('fsMobile.controllers', []).config(function ($stateProvider) {

    $stateProvider.state('app', {
        url: '/app',
        params: {appData: null},
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: function ($scope, $state, $ionicLoading, dataProvider,
                              EndpointDetector, $timeout, $ionicHistory) {
            $scope.appData = $scope.appData || $state.params.appData || {};

            function loadData (promise) {
                promise.then(function () {
                    return dataProvider.getData();
                }).then(function (data) {
                    $scope.appData = data;
                    $ionicHistory.clearCache();
                    $ionicLoading.hide();
                }, function (error) {
                    $ionicLoading.show({template: error});
                    $timeout(function () { $ionicLoading.hide(); }, 1500);
                });
            }

            $scope.deleteData = function () {
                $ionicLoading.show({template: 'Resetting...'});
                var promise = dataProvider.deleteData();
                loadData(promise);
            };

            $scope.refreshData = function () {
                $ionicLoading.show({template: 'Updating...'});
                // alwyas discover endpoint on refresh
                var promise = EndpointDetector.discoverEndpoint().then(function () {
                    return dataProvider.refreshData();
                });
                loadData(promise);
            };
        }
    });
});
