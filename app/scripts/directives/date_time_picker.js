//uses angular-bootstrap-datetimepicker: https://github.com/dalelotts/angular-bootstrap-datetimepicker

/*global
    angular
*/

'use strict';
angular.module('fsMobile.directives', [])
    .directive('myDateTimePicker', function () {
        return {
            restrict: 'E',
            template: '<input class="date-time-picker" type="text" readonly="readonly" ng-model="formatted_datetime" ng-click="popup()" placeholder="{{placeholder}}">',
            scope: {
                'title': '@',
                'dateModel': '=ngModel',
                'placeholder': '@'
            },
            controller: function ($scope, $filter, $ionicPopup) {
                $scope.formatted_datetime = $filter('date')($scope.dateModel, 'medium');
                $scope.tmp = {};
                $scope.tmp.newDate = $scope.dateModel || Date.now();

                $scope.onTimeSet = function (newDate, oldDate) {
                    console.log('Selected Date from Old date', oldDate, ' to ', newDate);
                };

                $scope.popup = function () {
                    $ionicPopup.show({
                        template: '<div class="my-date-time-picker"><Datetimepicker data-ng-model="tmp.newDate" data-on-time-set="onTimeSet"></datetimepicker></div>',
                        title: $scope.title,
                        scope: $scope,
                        buttons: [
                            {text: 'Cancel'},
                            {
                                text: '<b>Choose</b>',
                                type: 'button-positive',
                                onTap: function () {
                                    $scope.dateModel = $scope.tmp.newDate;
                                    $scope.formatted_datetime = $filter('date')($scope.tmp.newDate, 'medium');
                                }
                            } //second button
                        ] //buttons array
                    }); //ionicpopup.show
                }; //scope.popup();
            }
        };
    });
