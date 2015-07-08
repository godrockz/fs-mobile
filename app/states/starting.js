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
        params: {referer: null, promise: null},
        templateUrl: 'states/starting.html',
        controller: function ($scope, $timeout, $state, $q, dataProvider) {

            var next_state = $state.params.referer || 'app.news',
                promises = [$timeout(function(){return;}, 1500)];

            var promise = $state.params.promise;
            if (promise) {
                $scope.whatWeAreDoing = 'Updating local data';
                promise.catch(function(message) {
                    $scope.whatWeAreDoing = message;
                });
                promises.push(promise);
            } else {
                $scope.whatWeAreDoing = 'Starting app';
            }
            $q.all(promises).then(function () {
                $scope.whatWeAreDoing = 'Loading Data';
                dataProvider.getData().then(function (data) {
                    $state.go(next_state, {appData: data}, {reload: true});
                }).catch(function(message) {
                    $scope.whatWeAreDoing = message;
                });
            });
        }

    });
});
