'use strict';
angular.module('fsMobile.controllers', []).config(function ($stateProvider) {
    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: function ($scope, dataProvider, ENV) {
            $scope.resources = {};
            dataProvider.fetch(ENV.apiEndpoint).then(function (index) {
                $scope.resources.index = index;
            });
        }
    });
});

