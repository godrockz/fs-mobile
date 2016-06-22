/*jslint
 plusplus: true
 */
/*global
 angular, _
 */

'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {

    $stateProvider.state('app.program', {
        url: '/program/all/:locationId',
        data: {
            color: '#000000'
        },
        views: {
            'menuContent': {
                templateUrl: 'states/program/program_2.html',
                controller: function ($scope, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $ionicScrollDelegate,
                                      $stateParams, $translate, Colors, dataProvider) {
                    $scope.view = {};

                    var program_length = $scope.appData.program.length,
                        startSlideIndex = 0,
                        lang = $translate.use();
                    $scope.lang = lang;

                    /**
                     * for any reason ionic allows a slide.index > program_length.
                     * So we are required to calculate-proper index to access our $scope.appData.program
                     *
                     * @param add - is added to the current index
                     * @returns {number}
                     */
                    function programIdx(add) {
                        var length = program_length,
                            slideIdx = $scope.slide.index + (add || 0);
                        return Math.abs(slideIdx % length);
                    }

                    // jump to location if requested by param
                    if ($stateParams.locationId) {
                        startSlideIndex = _.findIndex($scope.appData.program, function (loc) {
                            return loc.id === $stateParams.locationId;
                        });
                        if (startSlideIndex < 0) {
                            startSlideIndex = 0;
                        }
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
                        var result = $scope.appData.program[index];
                        return result;
                    };

                    $scope.currentLocation = function () {
                        var result = $scope.appData.program[programIdx()];
                        return result;
                    };

                    if ($stateParams.locationId) {
                        $ionicSlideBoxDelegate.slide($stateParams.locationId);
                    }

                    $scope.slide = {index: startSlideIndex};

                    // scroll to top when the filter gets enabled
                    $scope.$watch('view.filterLiked',function(newValue){
                        if(newValue!== undefined && newValue===true){
                            $ionicScrollDelegate.scrollTop();
                        }
                    });

                    $scope.toggleLike = function (event) {
                        event.liked = !event.liked;
                        dataProvider.updateSingleObject('events', event.id, event, 'liked');
                    };

                    $scope.contrastColor = Colors.contrastColor;
                }
            }
        }
    });

    $stateProvider.state('app.singleprogram', {
        url: '/program/:idx',
        views: {
            'menuContent': {
                templateUrl: 'states/program/singleprogram.html',
                controller: function ($scope, $stateParams, $translate, dataProvider, $state, $rootScope) {

                    var lang = $translate.use();

                    if ($scope.appData.events) {
                        $scope.event = $scope.appData.events[$stateParams.idx];
                        $scope.event.location = $scope.appData.locations[$scope.event.locationRef];
                    }

                    $scope.event.tags = [];
                    for (var j = 0; j < $scope.event.translations[lang].tags.length; j++) {
                        $scope.event.tags.push($scope.event.translations[lang].tags[j]);
                    }

                    $scope.toggleLike = function () {
                        $scope.event.liked = !$scope.event.liked;
                        dataProvider.updateSingleObject('events', $scope.event.id, $scope.event, 'liked');
                    };

                    $scope.nextEvent = function () {
                        if ($scope.event.$nextEvent) {
                            $state.go('app.singleprogram', {idx: $scope.event.$nextEvent.id});
                        }
                    };

                    $scope.previousEvent = function () {
                        if ($scope.event.$previousEvent) {
                            $state.go('app.singleprogram', {idx: $scope.event.$previousEvent.id});
                        }
                    };

                    $rootScope.viewColor = $scope.event.color;
                    $state.current.data = {
                        color: $scope.event.color
                    }
                }
            }
        }
    });
});
