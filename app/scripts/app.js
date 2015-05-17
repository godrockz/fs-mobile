// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
'use strict';

angular.module('fsMobile.services', []);
angular.module('fsMobile', ['ionic','pascalprecht.translate',
    'LocalForageModule',
    'fsMobile.controllers',
    'fsMobile.states', 'fsMobile.rest',
    'fsMobile.services','fsMobile.filters',
    'config'])
    .config(function ($stateProvider, $urlRouterProvider,$translateProvider) {

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');


        $translateProvider.useStaticFilesLoader({
            prefix: 'lang/',
            suffix:'.json'
        });
        $translateProvider.determinePreferredLanguage();
        $translateProvider.registerAvailableLanguageKeys(['de_DE','en_EN'],{'de*':'de_DE','en*':'en_EN'});

    }).constant('AVAILABLE_LANGUAGES',['de_DE','en_EN'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    });
