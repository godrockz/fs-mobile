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
        onEnter: function ($state, appData) {
            // because this news page is the app entry point it must be manually checked if app is outdated.
            if (appData.outdated) {
                $state.go('app.outdated');
            }
        },
        views: {
            'menuContent': {
                templateUrl: 'states/news/news.html',
                controller: function ($scope, $filter, dataProvider) {

                    var filterLimitTo = $filter('limitTo');
                    $scope.initialLength = 7;

                    $scope.showMoreItems = function() {
                        $scope.itemsToDisplay += $scope.initialLength;
                        provideNewDataToScope();
                    };

                    function provideNewDataToScope(){
                        $scope.newsToShow = filterLimitTo($scope.appData.fsNews,$scope.itemsToDisplay);
                    }
                    $scope.$on('newDataAvailable', provideNewDataToScope);
                    $scope.itemsToDisplay = $scope.initialLength;
                    provideNewDataToScope();

                    $scope.toggleRead = function(item){
                        item.read = !item.read;
                        dataProvider.updateSingleObject('news', item.id, item, 'read');
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
                controller: function ($scope, $stateParams, $timeout, dataProvider) {

                    if ($scope.appData.news) {

                        $scope.news = $scope.appData.news[$stateParams.idx];

                    }

                    function setRead(item, read){
                        item.read = read;
                        dataProvider.updateSingleObject('news',item.id, item, 'read');
                    }

                    // mark a news as read
                    var markedManually = false;
                    var markAsReadTimeout = $timeout(function(){
                        if(markedManually){
                            return;
                        }
                        setRead($scope.news, true);
                    },3000);

                    $scope.toggleRead = function (item) {
                        markedManually = true; // disable timer
                        setRead(item,!item.read);
                    };

                    $scope.$on('$ionicView.leave',function(){
                        $timeout.cancel(markAsReadTimeout);
                    });

                }
            }
        }
    });
});
