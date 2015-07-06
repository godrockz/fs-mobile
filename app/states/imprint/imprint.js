/**
 * <p/>
 * Created by Bjoern Greiff
 * <p/>
 */

/*jslint
 browser: true, nomen: true
 */
/*global
 angular
 */
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {


    $stateProvider.state('app.imprint', {
        url: '/imrpint',
        views: {
            'menuContent': {
                templateUrl: 'states/imprint/imprint.html',
                controller: function () {


                }
            }
        }
    });
});
