/*jslint
  plusplus: true
*/
/*global
    angular, moment, _
*/

'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {

    $stateProvider.state('app.program', {
        url: '/program/all/:locationId',
        views: {
            'menuContent': {
                templateUrl: 'states/program/program_2.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $stateParams,
                                      $translate, Colors) {
                    $scope.view = {};

                    var program_length = $scope.appData.program.length,
                        startSlideIndex = 0;
                    var lang = $translate.use();
                    $scope.lang = lang;

                    /**
                     * for any reason ionic allows a slide.index > program_length.
                     * So we are required to calculate-proper index to access our $scope.appData.programm
                     *
                     * @param add - is added to the current index
                     * @returns {number}
                     */
                    function programIdx(add){
                        var length = program_length,
                            slideIdx = $scope.slide.index + (add || 0);
                        return Math.abs(slideIdx % length);
                    }

                    // jump to location if requested by param
                    if ($stateParams.locationId) {
                        startSlideIndex  = _.findIndex($scope.appData.program, function (loc) {
                            return loc.id === $stateParams.locationId;
                        });
                        if (startSlideIndex < 0) { startSlideIndex = 0; }
                    }

                    $ionicSideMenuDelegate.canDragContent(false);

                    $scope.nextTab = function () {
                        $ionicSlideBoxDelegate.next();
                    };

                    $scope.previousTab = function () {
                        $ionicSlideBoxDelegate.previous();
                    };

                    $scope.previousLocation = function () {
                        var index = programIdx(-1);
                        return $scope.appData.program[index];
                    };

                    $scope.nextLocation = function () {
                        var index = programIdx(+1);
                        var result =  $scope.appData.program[index];
                        return result;
                    };

                    $scope.currentLocation = function () {
                        var result =  $scope.appData.program[programIdx()];
                        return result;
                    };

                    if ($stateParams.locationId) {
                        $ionicSlideBoxDelegate.slide($stateParams.locationId);
                    }

                    $scope.slide = { index: startSlideIndex };

                    // THE NEW PROGRAM STYLE

                    // define a colors array for each location
                    var startValue = 20;

                    angular.forEach($scope.appData.program,function(location){

                        // precalculate colors array
                        var prev = Colors.rgb2hsv(location.color|| '#ffffff');
                        location.colors=[];
                        for (var i = 0 ; i< 24 ;i++){

                            prev.s = (i) * ((100 - startValue) / 24) + startValue;
                            location.colors[((i+6)%24)] = Colors.hsb2rgb(prev.h,prev.s,prev.v);
                        }

                    });

                    $scope.colorForEvent = function(event, location){
                        return location.colors[moment(event.start).hour()];
                    };

                    $scope.contrastColor = Colors.contrastColor;
                }
            }
        }
    });

    $stateProvider.state('app.singleprogram', {
        url: '/program/:idx',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'states/program/singleprogram.html',
                controller: function ($scope, $stateParams, $translate, dataProvider) {

                    var lang = $translate.use();

                    if ($scope.appData.events) {
                        $scope.event = $scope.appData.events[$stateParams.idx];
                        $scope.event.location = $scope.appData.locations[$scope.event.locationRef];
                    }

                    $scope.event.tags = [];
                    for(var j = 0; j < $scope.event.translations[lang].tags.length;j++){
                        $scope.event.tags.push($scope.event.translations[lang].tags[j]);
                    }
                    console.log('$scope.event', $scope.event);


                    $scope.toggleLike = function (){
                        $scope.event.liked = !$scope.event.liked;
                        dataProvider.updateSingleObject('events',$scope.event.id, $scope.event,'liked');
                    };
                }


            }
        }
    });
});
