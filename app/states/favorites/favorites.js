/**
 * showing up events selected as favorites
 * <p/>
 * Created by Benjamin Jacob on 07.04.16.
 * <p/>
 */
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {


    function emptyHours(){
        var result = [];
        for(var i = 0 ; i < 24 ; i++ ){
            result.push({});
        }
        return result;
    }



    $stateProvider.state('app.favorites', {
        url: '/favorites',
        views: {
            'menuContent': {
                templateUrl: 'states/favorites/favorites-list.html',
                controller: function ($scope) {
                    var eventHeight= 100;
                    // we provide liked events in location-columns

                    // first build a data-structure that reflects this
                    console.log('$scope.appData',$scope.appData);
                    // what comes in here is everything but WORKSHOP category events
                    $scope.locations = [];
                    var maxDays = -1;
                    angular.forEach($scope.appData.program,function(location){
                        var _location = angular.copy(location,{});
                        $scope.locations.push(_location);
                        if(location.days.length > maxDays){
                            maxDays = location.days.length;
                        }
                        angular.forEach(_location.days,function(day){
                            day.likedEvents = [];
                            day.hours = emptyHours()

                            angular.forEach(day.events,function(event){
                                if(event.liked && event.liked === true){
                                    // this is an event that should show up
                                     day.likedEvents.push(event);
                                    // add the event to the appropriate hour

                                    var startHour = moment(event.start).hour();
                                    console.log('event',event,startHour);
                                    var endHour = moment(event.end).hour();
                                    for(var i = startHour; i <= endHour; i++ ){
                                        if(!day.hours[i].events) {
                                            day.hours[i].events = [];
                                        }
                                        day.hours[i].events.push(event);
                                        console.log('adding to hours',i);
                                    }
                                    // TODO: as we should show the colors of
                                    // the day in here we might provide them @day
                                    // level with app data
                                }
                            });
                        });
                    });


                    // TODO collapse empty hours on all stages

                    $scope.view = {
                        columnWidth : 100/($scope.appData.program.length +2), // +2 = leftside for timeline right side for workshopzs
                        columnHeight : maxDays * 24 * eventHeight, // eventHeight px height per hour
                        eventHeight: eventHeight,
                        timeLine: []
                    };
                    for(var i = 0 ; i<=maxDays; i++){
                        $scope.view.timeLine.push({hours:emptyHours()});
                    }

                }
            }

        }
    });
});
