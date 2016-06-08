/*jslint
 plusplus: true
 */
/*global
 angular
 */


'use strict';
angular.module('fsMobile.states')
    .config(function ($stateProvider, $ionicConfigProvider) {

        $ionicConfigProvider.backButton.text(null).previousTitleText(null).icon(null);

        $stateProvider.state('app.outdated', {
            url: '/outdated',
            views: {
                'menuContent': {
                    templateUrl: 'states/outdated/outdated.html'
                }
            }
        });
    });
