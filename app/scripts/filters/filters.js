/**
 * simple filters
 * <p/>
 * Created by Benjamin Jacob on 09.03.15.
 * <p/>
 */

/*global
    angular, moment
*/

'use strict';
angular.module('fsMobile.filters', [])
    .filter('ucFirst', function () {
        return function (str) {
            return str.substring(0, 1).toUpperCase() + str.substring(1);
        };
    })
    .filter('jsonice', function () {
        return function (data) {
            return JSON.stringify(data, null, 1);
        };
    })
    .filter('timeFormat', function () {
        return function (time, property) {
            if (!time) { return ''; }
            return moment(time).format(property);
        };
    })
    .filter('trans', function ($translate) {
        return function (instance, property) {
            var lang = $translate.use(),
                translation = null;
            if (!instance) { return 'n.a'; }
            if (instance.translations && instance.translations[lang]) {
                translation = instance.translations[lang][property];
            }
            return translation || instance[property] || 'n.a';
        };
    })
    .filter('orderObjectBy', function(){
        return function(input, attribute, type) {
            if (!angular.isObject(input)){ return input; }
            if (!type) { type = 'int'; }

            switch (type){
                case 'int':
                    input.sort(function(a, b){
                        a = parseInt(a[attribute]);
                        b = parseInt(b[attribute]);
                        return a - b;
                    });
                    break;
                case 'date':
                    input.sort(function(a, b){
                        a = moment(a[attribute],'YYYY-MM-DD-HH:mm').format('YYYYMMDDHHmm');
                        b = moment(b[attribute],'YYYY-MM-DD-HH:mm').format('YYYYMMDDHHmm');
                        return a - b;
                    });
                    break;
            }
            return input;
        };
    })
    .filter('limitObjectTo', [function(){
        return function(obj, limit){
            var keys = Object.keys(obj);
            if(keys.length < 1){
                return [];
            }

            var ret = {},
                count = 0;
            angular.forEach(keys, function(key){
                if(count >= limit){
                    return false;
                }
                ret[key] = obj[key];
                count++;
            });
            return ret;
        };
    }]);
