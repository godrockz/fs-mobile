/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.states', []);
angular.module('fsMobile.states').config(function ($stateProvider) {
    console.log('state init');
    $stateProvider.state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'states/home/home.html',
                controller: function ($scope,$timeout, $state) {

                }
            }
        }
    });
});
