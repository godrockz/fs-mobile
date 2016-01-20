// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
'use strict';

/*jslint
  browser: true
*/
/*global
    angular
*/

angular.module('fsMobile.states', []);
angular.module('fsMobile.services', []);
angular.module('fsMobile', ['ionic', 'ngCordova',
    'tabSlideBox',
    'pascalprecht.translate',
    'LocalForageModule',
    'fsMobile.controllers',
    'fsMobile.states',
    'fsMobile.rest',
    'fsMobile.services',
    'fsMobile.filters',
    'fsMobile.directives',
    'ui.bootstrap.datetimepicker',
    'config',
    'ng-showdown'])
    .config(function ($urlRouterProvider, $translateProvider, $showdownProvider) {

        $showdownProvider.setOption('parseImgDimension', true);
        $showdownProvider.setOption('strikethrough', true);
        $showdownProvider.setOption('tables', true);

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/news');

        $translateProvider.useStaticFilesLoader({
            prefix: 'lang/',
            suffix: '.json'
        });
        $translateProvider.fallbackLanguage(['en', 'de']);
        var discoveredLanguage = $translateProvider.determinePreferredLanguage();
        $translateProvider.registerAvailableLanguageKeys(['de', 'en'], {
            'de*': 'de',
            'en*': 'en'
        });
        function guessLanguage(lang) {
            console.log(lang);
            if (lang && lang.length >= 5 && lang.indexOf('_') !== -1) {
                var parts = lang.split('_');
                if (parts.length > 0) {
                    return parts[0];
                }
            }
            if (lang && lang.length === 2) {
                return lang;
            }
            return 'de';
        }
        var lang = guessLanguage(discoveredLanguage);
        $translateProvider.use(lang);

    }).constant('AVAILABLE_LANGUAGES', ['de', 'en'])

    .run(function ($ionicPlatform) {

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default
            // (remove this to show the accessory bar above the keyboard for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                //window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                window.StatusBar.styleDefault();
            }
        });
    });
