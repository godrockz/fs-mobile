/**
 * TODO: Documentation
 * <p/>
 * Created by Benjamin Jacob on 12.05.15.
 * <p/>
 * © 2015 upSource GmbH, all rights reserved.
 */
'use strict';
angular.module('fsMobile.services').service('debug', function ($rootScope) {
    $rootScope.debugInfo = {};
    var svc = {
        addData: function (name, description, data) {
            $rootScope.debugInfo[name] = {
                description: description,
                data: data
            };
        }
    };

    return svc;


});
