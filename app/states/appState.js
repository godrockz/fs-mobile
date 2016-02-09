/*global
 angular, navigator
 */

'use strict';
angular.module('fsMobile.controllers', []).config(function ($stateProvider) {

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        resolve: {
            appData: function (dataProvider, $q) {
                var defered = $q.defer();
                dataProvider.getMetaInfo().then(function (metaInfo) {
                    return dataProvider.refreshData(metaInfo.fetched);
                }).finally(function () {
                    dataProvider.getData().then(function (data) {
                        defered.resolve(data);
                    }, function () {
                        defered.resolve({});
                    });
                });
                return defered.promise;
            }
        },
        controller: function ($scope, $ionicLoading, dataProvider,
                              $timeout, $ionicHistory, appData, AppData, $rootScope) {
            $scope.appData = new AppData(appData);

            function loadData (promise) {
                promise.then(function () {
                    return dataProvider.getData();
                }).then(function (data) {
                    $scope.appData = new AppData(data);
                    $ionicHistory.clearCache();
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                    $rootScope.$broadcast('newDataAvailable');
                }, function (error) {
                    $ionicLoading.show({template: error});
                    return $timeout(function () {
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                    }, 1500);
                });
            }

            $scope.deleteData = function () {
                $ionicLoading.show({template: 'Resetting...'});
                var promise = dataProvider.deleteData();
                loadData(promise);
            };

            $scope.refreshData = function () {
                // alwyas discover endpoint on refresh
                var ifModifiedSince = null;
                if ($scope.appData.$metaInfo) {
                    ifModifiedSince = $scope.appData.$metaInfo.fetched;
                }
                var promise = dataProvider.refreshData(ifModifiedSince);
                return loadData(promise);
            };


            $scope.$watch('$viewContentLoaded', function () {
                if (navigator.splashscreen) {
                    navigator.splashscreen.hide();
                }
            });
        }
    });
});
