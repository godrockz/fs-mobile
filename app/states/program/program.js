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
                                      $translate) {

                    var program_length = $scope.appData.program.length,
                        startSlideIndex = 0;
                    var lang = $translate.use();

                    $scope.getTags = function(event) {
                        var tags = [];
                        for(var j = 0; j < event.translations[lang].tags.length;j++){
                            tags.push(event.translations[lang].tags[j]);
                        }
                        return tags;
                    };

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
                    $scope.shade = function(hex, percent){
                        /* jshint -W016 */
                        var num = parseInt(hex.slice(1),16),
                            amt = Math.round(2.55 * percent),
                            R = (num >> 16) + amt,
                            G = (num >> 8 & 0x00FF) + amt,
                            B = (num & 0x0000FF) + amt;
                        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
                    };

                    $scope.colors = [];
                    var prev= '#BFAFFF';
                    for (var i = 0 ; i< 24 ; i++){
                        $scope.colors[((i+6)%24)] = prev = $scope.shade(prev,-1*60/24);
                    }

                    $scope.colorForEvent = function(event){
                        return $scope.colors[moment(event.start).hour()];
                    };

                    $scope.contrastColor=function(hex){
                        var num = parseInt(hex.slice(1),16),
                            /* jshint -W016 */
                            R = (num >> 16),
                            G = (num >> 8 & 0x00FF),
                            B = (num & 0x0000FF);

                        var brightness;
                        brightness = (R * 299) + (G * 587) + (B * 114);
                        brightness = brightness / 255000;

                        // values range from 0 to 1
                        // anything greater than 0.5 should be bright enough for dark text
                        if (brightness >= 0.5) {
                            return $scope.shade(hex,-100);
                        } else {
                            return $scope.shade(hex,100);
                        }
                    };

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
                controller: function ($scope, $stateParams, $translate) {

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
                }
            }
        }
    });
});
