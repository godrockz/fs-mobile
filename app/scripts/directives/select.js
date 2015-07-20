/**
 * @mhartington
 * based on:  http://forum.ionicframework.com/t/handling-select-options-and-ios-keyboards/
 */

/*global
    angular, window
*/

'use strict';
angular.module('fsMobile.directives', [])
    .directive('select', function($timeout) {
        return {
            restrict: 'E',
            link: function(_, element) {
                element.bind('focus', function() {
                    $timeout(function() {
                        if (window.cordova && window.cordova.plugins.Keyboard) {
                            window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                        }
                    });
                });
                element.bind('blur', function() {
                    $timeout(function() {
                        if (window.cordova && window.cordova.plugins.Keyboard) {
                            window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                        }
                    });
                });
            }
        };
    });
