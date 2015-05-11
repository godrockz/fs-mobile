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

                    var headHeight = document.getElementsByClassName('bar-header')[0].offsetHeight;
                    $scope.winHeight = window.innerHeight - headHeight;
                    $scope.winWidth = window.innerWidth;
                }
            }
        }
    });
});
