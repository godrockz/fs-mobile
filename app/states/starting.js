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
        params: {referer: null},
        templateUrl: 'states/starting.html',
        controller: function ($scope, $timeout, $state, dataProvider) {
            $scope.whatWeAreDoing = 'Starting...';

            var next_state = $state.params.referer || 'app.news';

            $timeout(function(){return;}, 1000).then(function () {
                $scope.whatWeAreDoing = 'Loading data...';
                dataProvider.getData().then(function (data) {
                    $state.go(next_state, {appData: data}, {reload: true});
                }).catch(function(message) {
                    $scope.whatWeAreDoing = message;
                    $timeout(function () {
                        $state.go(next_state, {appData: {}}, {reload: true});
                    }, 1500);
                });
            });
        }

    });
});
