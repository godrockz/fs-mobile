/**
 * <p/>
 * Created by Stefan Richter
 * <p/>
 */

/*jslint
  browser: true, nomen: true
*/
/*global
    angular
*/
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.map', {
        url: '/map',
        views: {
            'menuContent': {
                templateUrl: 'states/map/map.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicScrollDelegate) {

                    $ionicSideMenuDelegate.canDragContent(false);

                    var headHeight = document.getElementsByClassName('bar-header')[0].offsetHeight,
                        scrollDelegate = $ionicScrollDelegate.$getByHandle('siteplan');

                    $scope.winHeight = window.innerHeight - headHeight;
                    $scope.winWidth = window.innerWidth;

                    $scope.zoomlevel = 1;

                    $scope.zoomOut = function () {
                        $scope.zoomlevel = scrollDelegate.getScrollView().__zoomLevel - 0.5;
                        scrollDelegate.zoomTo($scope.zoomlevel);
                    };

                    $scope.zoomIn = function () {
                        $scope.zoomlevel = scrollDelegate.getScrollView().__zoomLevel + 0.5;
                        scrollDelegate.zoomTo($scope.zoomlevel);
                    };
                }
            }
        }
    });
});
