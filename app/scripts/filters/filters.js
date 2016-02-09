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
            if (!instance) { return ''; }
            if (instance.translations && instance.translations[lang]) {
                translation = instance.translations[lang][property];
            }
            return translation || instance[property] || 'n.a';
        };
    }).filter('filterNonPublished', function(){
        return function(data){
            var result = [];
            angular.forEach(data,function(item){
                if(!item.publishDate){ // no date given adding it
                    result.push(item);
                }
                var publishDate = moment(item.publishDate,moment.ISO_8601);
                if(publishDate && ! moment().isBefore(publishDate)){
                    // should currently be published
                    result.push(item);
                }
            });
            return result;
        };
    }).filter('orderObjectBy', function(){
        return function(input, attribute, type, dir) {
            if (!angular.isObject(input)){ return input; }
            if (!type) { type = 'int'; }

            dir = dir? dir.toLowerCase() : null;

            switch (type){
                case 'int':
                    input.sort(function(a, b){
                        a = parseInt(a[attribute]);
                        b = parseInt(b[attribute]);
                        return dir === 'desc' ? b - a : a - b;
                    });
                    break;
                case 'date':
                    input.sort(function(a, b){
                        a = moment(a[attribute],'YYYY-MM-DD-HH:mm').unix();
                        b = moment(b[attribute],'YYYY-MM-DD-HH:mm').unix();
                        return dir === 'desc' ? b - a : a - b;
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
