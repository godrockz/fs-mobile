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
        var result = angular.isDefined(location.markOnMap) &&
        location.markOnMap === true &&
        angular.isDefined(location.geoCoordinate);

        console.log('paule',location,result);

        return result;

    }

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
                    $scope.selection={};// will hold selected location as a container to prevent problems with inherited scopes
                    $scope.zoomlevel = 1;

                    console.log('locations',$scope.appData.locations);

                    // collect locations that can be displayed on map
                    $scope.mappedLocations = [];
                    angular.forEach($scope.appData.locations,function(location){
                        if(isLocationMappable(location)){
                            $scope.mappedLocations.push(location);
                        }
                    });
                    console.log('got ',$scope.mappedLocations.length,' found', $scope.mappedLocations);



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
