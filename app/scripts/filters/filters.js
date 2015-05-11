/**
 * simple filters
 * <p/>
 * Created by Benjamin Jacob on 09.03.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.filters', []).
    filter('ucFirst', function () {
        return function (str) {
            return str.substring(0, 1).toUpperCase() + str.substring(1);
        };
    })
    .filter('jsonice',function(){
        return function (data){
            return JSON.stringify(data,null,1);
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
            if (instance[property]) {
                return instance[property];
            } else {
                return instance;
            }
        }

        function doesLanguageExist(instance, lang) {
            if (instance && instance[translationsProperty][lang]) {
                return true;
            }
            return false;
        }

        return function (instance, property) {
            instance[translationsProperty]['de'][property]='wald';
            instance[translationsProperty]['en'][property]='wood';
            var currentLanguage = translations.getCurrentLanguage();
            //console.log('instance',instance,'lang',currentLanguage);
            if (isTranslateable(instance)) {
                fallBackToProperty(instance, property);
            }
            if (doesLanguageExist(instance, currentLanguage)) {
                // fallback to default language
                return instance[translationsProperty][currentLanguage][property];
            } else {
                fallBackToProperty(instance, property);
            }
        };
    });
