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

    function isLocationMappable(location){
        var result = angular.isDefined(location.geoCoordinate);
        return result;

    }

    $stateProvider.state('app.map', {
        url: '/map',
        views: {
            'menuContent': {
                templateUrl: 'states/map/map.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicScrollDelegate, debug) {
                    $ionicSideMenuDelegate.canDragContent(false);

                    var headHeight = document.getElementsByClassName('bar-header')[0].offsetHeight,
                        scrollDelegate = $ionicScrollDelegate.$getByHandle('siteplan'),
                        maxZoomLevel = 1.5, // 3 is max by ionic
                        minZoomLevel = 0.5, // 0.5 is min by ionic
                        zoomStep = 0.25,
                        initialZoomLevel=0.5;

                    function safeApply(fn){
                        if (!$scope.$$phase) {
                            $scope.$apply(fn);
                        } else {
                            fn();
                        }
                    }

                    function updateScreenSize(headHeight) {
                        $scope.winHeight = window.innerHeight - headHeight;
                        $scope.winWidth = window.innerWidth;
                     }

                    function updateOrientation(headheight){
                        return function() { // factory to safely propagate the headheight
                            safeApply(function () {
                                var prevWidth = $scope.winWidth;
                                var prevHeight = $scope.winHeight;
                                updateScreenSize(headheight);
                                scrollDelegate.resize();

                                debug.addData('orientation', 'discover orientation change', {
                                    prevWidth: prevWidth, prevHeight: prevHeight,
                                    width: $scope.winWidth, height: $scope.winHeight,
                                    scrollView: scrollDelegate.getScrollView()
                                });
                            });
                        };
                    }
                    updateScreenSize(headHeight);
                    $scope.selection={};// will hold selected location as a container to prevent problems with inherited scopes
                    $scope.zoomlevel = initialZoomLevel;
                    $scope.minZoom = minZoomLevel;
                    $scope.maxZoom = maxZoomLevel;

                    // HANDLE ORIENTATION CHANGES portrait / landscape
                    $scope._updateOrientation = updateOrientation(headHeight);
                    window.addEventListener('orientationchange', $scope._updateOrientation, false);
                    $scope.$on('$destroy',function(){
                        // remove native listener on scope destroy
                        window.removeEventListener('orientationchange', $scope._updateOrientation);
                    });

                    // collect locations that can be displayed on map
                    $scope.mappedLocations = [];
                    angular.forEach($scope.appData.locations,function(location){
                        if(isLocationMappable(location)){
                            $scope.mappedLocations.push(location);
                        }
                    });
                    console.log('got ',$scope.mappedLocations.length,' found', $scope.mappedLocations);

                    $scope.zoomOut = function () {
                        if($scope.zoomlevel - zoomStep < minZoomLevel){
                            return;
                        }
                        $scope.zoomlevel = scrollDelegate.getScrollView().__zoomLevel - zoomStep;
                        scrollDelegate.zoomTo($scope.zoomlevel);
                    };

                    $scope.zoomIn = function () {
                        if($scope.zoomlevel + zoomStep > maxZoomLevel ){
                            return;
                        }
                        $scope.zoomlevel = scrollDelegate.getScrollView().__zoomLevel + zoomStep;
                        scrollDelegate.zoomTo($scope.zoomlevel);
                    };
                    // default zoom 
                    scrollDelegate.zoomTo($scope.zoomlevel);
                }
            }
        }
    });
});
