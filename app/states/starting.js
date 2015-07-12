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
        params: {referer: null, stateParams: null},
        templateUrl: 'states/starting.html',
        controller: function ($scope, $timeout, $state, dataProvider) {
            $scope.whatWeAreDoing = 'Starting...';

            var next_state = $state.params.referer || 'app.news',
                params = $state.params.stateParams || {};

            $timeout(function(){return;}, 1000).then(function () {
                $scope.whatWeAreDoing = 'Loading data...';
                dataProvider.getData().then(function (data) {
                    params.appData = data;
                    $state.go(next_state, params, {reload: true});
                }).catch(function(message) {
                    $scope.whatWeAreDoing = message;
                    $timeout(function () {
                        params.appData = {};
                        $state.go(next_state, params, {reload: true});
                    }, 1500);
                });
            });
        }

    });
});
