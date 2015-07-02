/**
 * <p/>
 * Created by Benjamin Jacob on 02.07.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.directives').directive('fsSrc', function ($log, ConnectionState) {
    var images = {
        concert: [
            'images/random/bands_01.png',
            'images/random/bands_02.png',
            'images/random/bands_03.png',
            'images/random/bands_04.png'
        ],
        electro: [
            'images/random/electro_01.png',
            'images/random/electro_02.png'
        ],
        workshop: [
            'images/random/workshop_01.png',
            'images/random/workshop_02.png'
        ]
    };

    function getRandomOfflineImage(topic) {
        if (topic === undefined || topic === null || topic.length === 0) {
            topic = 'concert';
        }
        return images[topic][Math.floor(Math.random() * images[topic].length)];
    }

    function setImage(elem, attrs, url) {

        if (elem[0].tagName === 'img') {
            attrs.$set('src', url);
        } else {
            // use background image url
            console.log('elem', elem[0]);
            elem[0].style.backgroundImage = 'url(\'' + url + '\')';
            elem.addClass = 'fssrc';
        }
    }

    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            console.log('fsSrc running');
            var defaults = attrs.topic || 'concert';
            if (!attrs.fsSrc) {
                $log.error('angular expression expected within fs-src attribute');
            }
            var onlineSrc = scope.$eval(attrs.fsSrc);
            console.log('got as online src', onlineSrc);
            ConnectionState.isOnline().then(function (isOnline) {
                if (isOnline) {
                    console.log('isOnline true');
                    setImage(elem, attrs, onlineSrc);
                } else {
                    console.log('isOnline false');
                    setImage(elem, attrs, getRandomOfflineImage(defaults));
                }
            }, function (err) {
                console.log('err', err);
                attrs.$set('src', getRandomOfflineImage(defaults));
            });
        }
    };
});
