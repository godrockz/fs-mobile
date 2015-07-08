/**
 * <p/>
 * Created by Benjamin Jacob on 12.05.15.
 * <p/>
 * © 2015 upSource GmbH, all rights reserved.
 */

/*global
    angular
*/
'use strict';
angular.module('fsMobile.services').service('debug', function ($rootScope) {
    $rootScope.debugInfo = {};
    var debug = false;
    var svc = {
        isDebugEnabled:function(){
            return debug;
        },
        setDebug: function (val){
            debug = val;
            svc.addData('debug','mode',{enabled:debug});
        },
        addData: function (name, description, data) {
            $rootScope.debugInfo[name] = {
                description: description,
                data: data
            };
        }
    };
    return svc;
});
