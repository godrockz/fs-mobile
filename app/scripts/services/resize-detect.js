/**
 * store dimensions of screen in root scope
 * <p/>
 * Created by Benjamin Jacob on 12.04.16.
 * <p/>
 * © 2016 upSource GmbH, all rights reserved.
 */
'use strict';
angular.module('fsMobile.services').run( function ($rootScope, $window) {

    var width = $window.innerWidth;
    var height = $window.innerHeight;
    $rootScope.dimension = {
        width: width,
        height: height
    };

    $rootScope.$watch(function () {
        return $window.innerWidth;
    }, function (value) {
        if (!value) {
            return;
        }
        width = value;
        $rootScope.dimension.width = width;
    });

    $rootScope.$watch(function () {
        return $window.innerHeight;
    }, function (value) {
        if (!value) {
            return;
        }
        height = value;
        $rootScope.dimension.height = height;
    });
});
