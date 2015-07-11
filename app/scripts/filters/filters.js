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
    .filter('trans', function (translations) {
        var translationsProperty = 'translations';

        function isTranslateable(instance) {
            if (instance && instance[translationsProperty]) {
                return true;
            }
            return false;
        }

        function fallBackToProperty(instance, property) {
            if(!instance){
                return 'n.a.';
            }
            if (instance[property]) {
                return instance[property];
            }
            return instance;
        }

        function doesLanguageExist(instance, lang) {
            if (instance && instance[translationsProperty][lang]) {
                return true;
            }
            return false;
        }

        return function (instance, property) {
            var currentLanguage = translations.getCurrentLanguage();
            if(currentLanguage && currentLanguage.length>2 ){
                currentLanguage = currentLanguage.substring(0,2);
            }
            //console.log('instance',instance,'lang',currentLanguage);
            var result;
            if (!isTranslateable(instance)) {
                result = fallBackToProperty(instance, property);
            }
            else if (doesLanguageExist(instance, currentLanguage)) {
                // fallback to default language
                result = instance[translationsProperty][currentLanguage][property];
            }else{
                // more defaults
                result = fallBackToProperty(instance, property);
            }
            //console.log('translated result',result);
            return result;
        };
    })
    .filter('orderObjectBy', function(){
        return function(input, attribute, type) {
            if (!angular.isObject(input)){ return input; }
            if (!type){ type = 'int'; }

            var objectArray = [];
            for(var objectKey in input) {
                if(typeof input[objectKey] === 'object'){
                    objectArray.push(input[objectKey]);
                }
            }

            switch (type){
                case 'int':
                    objectArray.sort(function(a, b){
                        a = parseInt(a[attribute]);
                        b = parseInt(b[attribute]);
                        return a - b;
                    });
                    break;
                case 'date':
                    objectArray.sort(function(a, b){
                        a = moment(a[attribute],'YYYY-MM-DD-HH:mm').format('YYYYMMDDHHmm');
                        b = moment(b[attribute],'YYYY-MM-DD-HH:mm').format('YYYYMMDDHHmm');
                        return a - b;
                    });
                    break;
            }
            return objectArray;
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
