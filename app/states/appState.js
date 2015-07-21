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
            appData: function (dataProvider) {
                var promise = dataProvider.getMetaInfo().then(function (metaInfo) {
                    return dataProvider.refreshData(metaInfo.fetched);
                }).finally(function () {
                    return dataProvider.getData();
                });
                return promise;
            }
        },
        controller: function ($scope, $ionicLoading, dataProvider,
                              $timeout, $ionicHistory, appData, AppData) {
            $scope.appData = new AppData(appData);

            function loadData (promise) {
                promise.then(function () {
                    return dataProvider.getData();
                }).then(function (data) {
                    $scope.appData = new AppData(data);
                    $ionicHistory.clearCache();
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
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
