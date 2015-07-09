/*global
 angular
 */

'use strict';
angular.module('fsMobile.controllers', []).config(function ($stateProvider) {

    $stateProvider.state('app', {
        url: '/app',
        params: {appData: null},
        cache: false, // this is needed because reload: true for $state.go doesn't work
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: function ($scope, $state, dataProvider, EndpointDetector) {
            $scope.appData = $state.params.appData || {};

            var loadData = function (promise) {
                $state.go('starting', {promise: promise}, {reload: true});
            };

            $scope.deleteData = function () {
                var promise = dataProvider.deleteData();
                loadData(promise);
            };

            $scope.refreshData = function () {
                // alwyas discover endpoint on refresh
                var promise = EndpointDetector.discoverEndpoint().then(function () {
                    return dataProvider.refreshData().then(function (data) {
                        console.log('refresh: new data saved', data);
                    });
                });
                loadData(promise);
            };
        }
    });
});
