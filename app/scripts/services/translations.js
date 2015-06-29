/**
 * simple language helper
 * <p/>
 * Created by Benjamin Jacob on 11.05.15.
 * <p/>
 */

/*global
    angular
*/

'use strict';
angular.module('fsMobile.services').service('translations', function ($translate, $rootScope) {

    var currentLanguage,
        defaultLanguage = 'en';

    function guessLanguage(langIdentifier) {
        if (langIdentifier && langIdentifier.length >= 5 && langIdentifier.indexOf('_') !== -1) {
            var parts = langIdentifier.split('_');
            if (parts.length > 0) {
                return parts[0];
            }
        }
        if (langIdentifier && langIdentifier.length === 2) {
            return langIdentifier;
        }
        return defaultLanguage;
    }

    $rootScope.$on('translationChanged', function () {
        currentLanguage = undefined;
    });

    return {
        getCurrentLanguage: function () {
            if (!currentLanguage) {
                currentLanguage = guessLanguage($translate.use());
            }
            return currentLanguage;
        },
        getDefaultLanguage: function () {
            return defaultLanguage;
        }
    };
});
