/**
 * translation support
 * <p/>
 * Created by Benjamin Jacob on 01.04.16.
 * <p/>
 */
'use strict';
angular.module('fsMobile.services')
    .constant('AVAILABLE_LANGUAGES', ['de', 'en'])
    .config(function ($translateProvider) {

        $translateProvider.useStaticFilesLoader({
            prefix: 'lang/',
            suffix: '.json'
        });
        $translateProvider.registerAvailableLanguageKeys(['de', 'en'], {
            'de*': 'de',
            'en*': 'en'
        });
        $translateProvider.determinePreferredLanguage();


    })
    .run(function (LanguageService) {
        LanguageService.discoverAndSetupLanguage();

    })
    .service('LanguageService', function ($rootScope, $ionicHistory, $q, $localForage
        , AVAILABLE_LANGUAGES, $translate) {

        var currentLanguageKey = 'currentLanguage';


        /**
         * discovers best matching user language.
         * should use locale
         * @returns {*}
         */
        function discoverBestMatchingLanguage() {
            // TODO: maybe a plugin would do a better job?
            var lang = window.navigator.userLanguage || window.navigator.language;
            var defaultLang = 'de';
            if (lang && lang.length >= 5 && lang.indexOf('_') !== -1) {
                var parts = lang.split('_');
                if (parts.length > 0) {
                    return parts[0];
                }
            }
            if (lang && lang.length === 2) {
                return lang;
            }
            return defaultLang;
        }

        var svc = {

            discoverAndSetupLanguage: function () {
                // discover stored language and use it.
                $localForage.getItem(currentLanguageKey)
                    .then(function (language) {
                        if (language === null) {
                            language = discoverBestMatchingLanguage();
                        }
                        svc.setLanguage(language);

                    }, function () {
                        // on error use best matching lang
                        var language = discoverBestMatchingLanguage();
                        svc.setLanguage(language);
                    });
            },

            /**
             * changes the language of the application
             *
             * 'translationChanged' event is transmitted if
             * language change was successful
             * @param expects a 2 character language code
             */
            setLanguage: function (lang) {
                $q.when($translate.use(lang))
                    .then(function () {
                        $ionicHistory.clearCache();
                        $rootScope.$emit('translationChanged');
                        $localForage.setItem(currentLanguageKey, lang);
                    });
            },
            getCurrentLanguage: function () {
                return $translate.use();
            },
            /**
             * an array of available languages
             * @returns {AVAILABLE_LANGUAGES|*}
             */
            getAvailableLanguages: function () {
                return AVAILABLE_LANGUAGES;
            }
        };
        return svc;
    });
