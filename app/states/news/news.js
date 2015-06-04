/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.states', []);
angular.module('fsMobile.states').config(function ($stateProvider) {
    console.log('state init');
    $stateProvider.state('app.news', {
        url: '/news',
        views: {
            'menuContent': {
                templateUrl: 'states/news/news.html',
                controller: function ($scope) {


                    $scope.news = $scope.appData.news;

                    console.log('news',$scope.news);

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

                    if($scope.appData.news){

                        $scope.news= $scope.appData.news[$stateParams.idx];

                        console.log('SINGLE NEWS',$scope.appData.news);
                    }

                    //$scope.$watch('resources.news',function(){
                    //    if($scope.resources.news){
                    //        $scope.news = $scope.resources.news[$stateParams.idx];
                    //    }
                    //});
                }
            }
        }
    });
});
