/**
 * starting view
 * <p/>
 * Created by Benjamin Jacob on 18.05.15.
 * <p/>
 */

/*global
    angular
*/
'use strict';
angular.module('fsMobile.controllers').config(function ($stateProvider) {
    $stateProvider.state('starting', {
        url: '/',
        templateUrl: 'states/starting.html',
        controller: function ($scope, $timeout, $state, $q, EndpointDetector) {
            var timerDestruct;
            EndpointDetector.discoverEndpoint();
            var factor = 0.25;

            function addTimer(txt, ms) {
                var deferred = $q.defer();
                $scope.whatWeAreDoing = txt;
                timerDestruct = $timeout(function () {
                    deferred.resolve();
                }, factor *( ms || 1000));
                return deferred.promise;
            }
            addTimer('initalizing application').then(function () {
                return addTimer('loading data');
            }).then(function () {
                return addTimer('refining locations');
            }).then(function () {
                return addTimer('communication with NSA');
            }).then(function () {
                return addTimer('translate for saxons', 4000);
            }).then(function () {
                return addTimer('error with saxon descent', 2000);
            }).then(function () {
                return addTimer('providing english and german only', 2000);
            }).then(function () {
                return addTimer('running app', 1000);
            }).then(function () {
                $state.go('app.news');
            });

            console.log('starting the app');

            $scope.$on('$destroy', function () {
                if (angular.isFunction(timerDestruct)) {
                    timerDestruct();
                }
            });
        }

    });
});
