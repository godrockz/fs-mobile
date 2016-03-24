/**
 * <p/>
 * Created by Benjamin Jacob on 02.07.15.
 * <p/>
 */

/*global
    angular
*/
'use strict';
angular.module('fsMobile.directives').directive('fsSrc', function ($log, DYNENV, ConnectionState, DefaultImages) {

    function setImage(elem, attrs, url) {
        if (elem[0].tagName === 'img') {
            attrs.$set('src', url);
        } else {
            // use background image url
            elem[0].style.backgroundImage = 'url(\'' + url + '\')';
            elem.addClass('fssrc');
        }
    }

    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            var defaults = attrs.topic || 'concert',
                onlineSrc = scope.$eval(attrs.fsSrc);
            if (!attrs.fsSrc) {
                $log.error('angular expression expected within fs-src attribute');
            }
            if (!onlineSrc) {
                setImage(elem, attrs, DefaultImages.getRandomImage(defaults));
                return;
            }
            ConnectionState.checkOnline().then(function (isOnline) {
                if (isOnline) {
                    var absoluteUri = (DYNENV.apiEndpoint||'') + onlineSrc;
                    setImage(elem, attrs, absoluteUri);
                } else {
                    setImage(elem, attrs, DefaultImages.getRandomImage(defaults));
                }
            }, function () {
                setImage(elem, attrs, DefaultImages.getRandomImage(defaults));
            });
        }
    };
});
