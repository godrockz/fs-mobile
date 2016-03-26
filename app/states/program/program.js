/*jslint
  plusplus: true
*/
/*global
    angular, moment, _
*/

'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
/*
    function hsb2rgb(hue, saturation, value) {
        hue = (parseInt(hue, 10) || 0) % 360;

        saturation = /%/.test(saturation)
            ? parseInt(saturation, 10) / 100
            : parseFloat(saturation, 10);

        value = /%/.test(value)
            ? parseInt(value, 10) / 100
            : parseFloat(value, 10);

        saturation = Math.max(0, Math.min(saturation, 1));
        value = Math.max(0, Math.min(value, 1));

        var rgb;
        if (saturation === 0) {
            return [
                Math.round(255 * value),
                Math.round(255 * value),
                Math.round(255 * value)
            ];
        }

        var side = hue / 60;
        var chroma = value * saturation;
        var x = chroma * (1 - Math.abs(side % 2 - 1));
        var match = value - chroma;

        switch (Math.floor(side)) {
            case 0: rgb = [ chroma, x, 0 ]; break;
            case 1: rgb = [ x, chroma, 0 ]; break;
            case 2: rgb = [ 0, chroma, x ]; break;
            case 3: rgb = [ 0, x, chroma ]; break;
            case 4: rgb = [ x, 0, chroma ]; break;
            case 5: rgb = [ chroma, 0, x ]; break;
            default: rgb = [ 0, 0, 0 ];
        }

        rgb[0] = Math.round(255 * (rgb[0] + match));
        rgb[1] = Math.round(255 * (rgb[1] + match));
        rgb[2] = Math.round(255 * (rgb[2] + match));

        return '#' + pad(rgb[0].toString(16),2,0) + pad(rgb[1].toString(16),2,0) + pad(rgb[2].toString(16),2,0);

    }
    */

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
/*
    function rgb2hsv (hex) {
        var num = parseInt(hex.slice(1),16),
        /* jshint -W016 * i/
            R = (num >> 16),
            G = (num >> 8 & 0x00FF),
            B = (num & 0x0000FF);
        var rr, gg, bb,
            r = R / 255,
            g = G / 255,
            b = B / 255,
            h, s,
            v = Math.max(r, g, b),
            diff = v - Math.min(r, g, b),
            diffc = function(c){
                return (v - c) / 6 / diff + 1 / 2;
            };

        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(r);
            gg = diffc(g);
            bb = diffc(b);

            if (r === v) {
                h = bb - gg;
            }else if (g === v) {
                h = (1 / 3) + rr - bb;
            }else if (b === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            }else if (h > 1) {
                h -= 1;
            }
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }
    */


    $stateProvider.state('app.program', {
        url: '/program/all/:locationId',
        views: {
            'menuContent': {
                templateUrl: 'states/program/program_2.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $stateParams,
                                      $translate) {
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

                    // darkens a color by given percentage
                    $scope.shade = function(hex, percent){
                        /* jshint -W016 */
                        var num = parseInt(hex.slice(1),16),
                            amt = Math.round(2.55 * percent),
                            R = (num >> 16) + amt,
                            G = (num >> 8 & 0x00FF) + amt,
                            B = (num & 0x0000FF) + amt;
                        return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
                    };



                    // define a color for each location

                    /*var startColor = '#BAFFD5',
                        startColorHsv = rgb2hsv(startColor),
                        stepSize = 220/$scope.appData.program.length ;
                    console.log('$scope data',$scope.appData.program);

                    console.log('stepSize',stepSize);
                    console.log('startColorHsv',startColorHsv);
                    console.log('step-size',stepSize);*/
                    angular.forEach($scope.appData.program,function(location){
                        /*console.log('start color',startColorHsv.h + stepSize);
                        startColorHsv.h =  (startColorHsv.h + stepSize) % 255;


                        console.log('newH',startColorHsv.h);
                        location.color = hsb2rgb(startColorHsv.h,startColorHsv.s, startColorHsv.v);
                        console.log('results in',location.color);

                        */
                        // precalculate colors array
                        var prev = location.color||'#ffffff';
                        location.colors=[];
                        for (var i = 0 ; i< 24 ; i++){
                            location.colors[((i+6)%24)] = prev = $scope.shade(prev,-1*90/24);
                        }

                    });

                    $scope.colorForEvent = function(event, location){
                        return location.colors[moment(event.start).hour()];
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
