/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */

/*global
    angular
*/
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider, $ionicConfigProvider) {

    $ionicConfigProvider.backButton.text('').previousTitleText('').icon('ion-chevron-left');

    $stateProvider.state('app.news', {
        url: '/news',
        views: {
            'menuContent': {
                templateUrl: 'states/news/news.html',
                controller: function ($scope, $filter) {

                    $scope.news = $scope.appData.news || {};
                    $scope.news = $filter('filter')($scope.news,{deleted : false});
                    $scope.news = $filter('orderObjectBy')($scope.news,'publishDate','date');

                    if(!angular.isDefined($scope.news)){
                        $scope.newsLength = 0;
                    }else {
                        $scope.newsLength = Object.keys($scope.news).length;
                    }
                    $scope.itemsToDisplay = $scope.newsLength>7?7:$scope.newsLength;

                    $scope.showMoreItems = function() {
                        $scope.itemsToDisplay += $scope.newsLength>7?7:$scope.newsLength;
                    };

                }
            }
        }
    });

    $stateProvider.state('app.singlenews', {
        url: '/news/:idx',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'states/news/singlenews.html',
                controller: function ($scope, $stateParams) {

                    if ($scope.appData.news) {

                        $scope.news = $scope.appData.news[$stateParams.idx];

                        console.log('SINGLE NEWS', $scope.appData.news);
                    }
                }
            }
        }
    });
});
