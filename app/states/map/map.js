/**
 * <p/>
 * Created by Stefan Richter
 * <p/>
 */
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.map', {
        url: '/map',
        views: {
            'menuContent': {
                templateUrl: 'states/map/map.html',
                controller: function ($scope, $ionicSideMenuDelegate) {

                    $ionicSideMenuDelegate.canDragContent(false);

                    var head_height = document.getElementsByClassName("bar-header")[0].offsetHeight;
                    $scope.winHeight = window.innerHeight - head_height;
                    $scope.winWidth = window.innerWidth;
                }
            }
        }
    });
});
