/*jslint
 plusplus: true
 */
/*global
 angular
 */


'use strict';
angular.module('fsMobile.states')
    .config(function ($stateProvider) {

        $stateProvider.state('app.outdated', {
            url: '/outdated',
            views: {
                'menuContent': {
                    templateUrl: 'states/outdated/outdated.html'
                }
            }
        });
    });
