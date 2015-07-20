/**
 * @mhartington
 * based on:  http://forum.ionicframework.com/t/handling-select-options-and-ios-keyboards/
 */

angular.module('fsMobile.directives', [])
    .directive('select', function($timeout) {
        return {
            restrict: 'E',
            link: function(_, element) {
                element.bind('focus', function(e) {
                    $timeout(function() {
                        if (window.cordova && window.cordova.plugins.Keyboard) {
                            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                        }
                    })
                });
                element.bind('blur', function(e) {
                    $timeout(function() {
                        if (window.cordova && window.cordova.plugins.Keyboard) {
                            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                        }
                    });
                });
            }
        }
    });