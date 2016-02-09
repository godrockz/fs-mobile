/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */

/*global
    angular
*/
'use strict';
angular.module('fsMobile.states')
    .config(function ($stateProvider, $ionicConfigProvider) {

    $ionicConfigProvider.backButton.text('').previousTitleText('').icon('ion-chevron-left');

    $stateProvider.state('app.news', {
        url: '/news',
        views: {
            'menuContent': {
                templateUrl: 'states/news/news.html',
                controller: function ($scope, $filter) {
                    var filterLimitTo = $filter('limitTo');
                    $scope.initialLength = 7;

                    $scope.showMoreItems = function() {
                        $scope.itemsToDisplay += $scope.initialLength;
                        provideNewDataToScope();
                    };

                    function provideNewDataToScope(){
                        $scope.itemsToDisplay = $scope.initialLength;
                        $scope.newsToShow = filterLimitTo($scope.appData.fsNews,$scope.itemsToDisplay);
                    }
                    $scope.$on('newDataAvailable', provideNewDataToScope);
                    provideNewDataToScope();
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
