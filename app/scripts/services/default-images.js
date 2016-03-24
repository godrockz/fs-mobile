'use strict';
angular.module('fsMobile.services')
    .factory('DefaultImages', function () {

        var images = {
            concert: [
                'images/random/sw-bands_01.png',
                'images/random/sw-bands_02.png',
                'images/random/sw-bands_03.png',
                'images/random/sw-bands_04.png'
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

        var svc = {
            /**
             *
             * @param topic
             * @returns {url of random image
             */
            getRandomImage: function (topic) {
                if (topic === undefined || topic === null || topic.length === 0 || images[topic] === undefined ) {
                    topic = 'concert';
                }
                return images[topic][Math.floor(Math.random() * images[topic].length)];
            }
        };
        return svc;
    });
