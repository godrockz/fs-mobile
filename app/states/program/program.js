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
                templateUrl: 'states/program/program.html',
                controller: function ($scope, $ionicSideMenuDelegate,
                                      $ionicSlideBoxDelegate, $stateParams, $translate) {
                    var program_length = $scope.appData.program.length,
                        currentDateTime = moment('2015-08-30T12:30'),
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
                     * So we are required to calculateproper index to access our $scope.appData.programm
                     *
                     * @param add - is added to the current index
                     * @returns {number}
                     */
                    function programIdx(add){
                        var length = program_length,
                            slideIdx = $scope.slide.index + (add || 0),
                            // factor * length can be subtracted from resultIdx
                            factor = Math.floor(slideIdx / length),
                            resultIdx = slideIdx - (length * factor);
                        return resultIdx;
                    }

                    // jump to location if requested by param
                    if ($stateParams.locationId) {
                        startSlideIndex  = _.findIndex($scope.appData.program, function (loc) {
                            return loc.id === $stateParams.locationId;
                        });
                        if (startSlideIndex < 0) { startSlideIndex = 0; }
                    }

                    $ionicSideMenuDelegate.canDragContent(false);

                    $scope.isRunning = function (event) {
                        var eStart = moment(event.start),
                            eEnd = event.end ? moment(event.end) : moment(event.start).endOf('day');
                        return currentDateTime >= eStart && currentDateTime <= eEnd;
                    };

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
