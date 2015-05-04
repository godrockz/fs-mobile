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

                    $scope.config = {}; // use defaults
                    $scope.model = {}; // always pass empty object

                    $ionicSideMenuDelegate.canDragContent(false);

                    //var shark = {
                    //    x: 391,
                    //    y: 371,
                    //    width: 206,
                    //    height: 136
                    //};
                    //var chopper = {
                    //    x: 88,
                    //    y: 213,
                    //    width: 660,
                    //    height: 144
                    //};
                    //var ladder = {
                    //    x: 333,
                    //    y: 325,
                    //    width: 75,
                    //    height: 200
                    //};

                    //$scope.rects = [chopper, shark, ladder];

                    // Instantiate models which will be passed to <panzoom> and <panzoomwidget>

                    // The panzoom config model can be used to override default configuration values
                    //$scope.panzoomConfig = {
                    //    zoomLevels: 12,
                    //    neutralZoomLevel: 5,
                    //    scalePerZoomLevel: 1.5,
                    //    startTransform: 'scale(1.1)',
                    //    increment: 0.1,
                    //    minScale: 1,
                    //    contain: 'invert'
                    //
                    //};

                    // The panzoom model should initialle be empty; it is initialized by the <panzoom>
                    // directive. It can be used to read the current state of pan and zoom. Also, it will
                    // contain methods for manipulating this state.
                    //$scope.panzoomModel = {};

                    //$scope.zoomToShark = function () {
                    //    PanZoomService.getAPI('PanZoom').then(function (api) {
                    //        api.zoomToFit(shark);
                    //    });
                    //};
                    //
                    //$scope.zoomToChopper = function () {
                    //    PanZoomService.getAPI('PanZoom').then(function (api) {
                    //        api.zoomToFit(chopper);
                    //    });
                    //};
                    //
                    //$scope.zoomToLadder = function () {
                    //    PanZoomService.getAPI('PanZoom').then(function (api) {
                    //        api.zoomToFit(ladder);
                    //    });
                    //};


                }
            }
        }
    });
});
