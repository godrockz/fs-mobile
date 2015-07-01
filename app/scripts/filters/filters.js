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
            // WTF ist this ?
            //instance[translationsProperty].de[property] = 'wald';
            //instance[translationsProperty].en[property] = 'wood';
            var currentLanguage = translations.getCurrentLanguage();
            if(currentLanguage && currentLanguage.length>2 ){
                currentLanguage = currentLanguage.substring(0,2);
            }
            //console.log('instance',instance,'lang',currentLanguage);
            var result;
            if (!isTranslateable(instance)) {
                console.log('not translateable');
                result = fallBackToProperty(instance, property);
            }
            else if (doesLanguageExist(instance, currentLanguage)) {
                console.log('translateable and lang exists ',currentLanguage,property,instance);
                // fallback to default language
                result = instance[translationsProperty][currentLanguage][property];
            }else{
                console.log('nothing @all');
                // more defaults
                result = fallBackToProperty(instance, property);
            }
            console.log('translated result',result);
            return result;
        };
    });
