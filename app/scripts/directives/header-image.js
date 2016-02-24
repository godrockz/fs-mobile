'use strict';
angular.module('fsMobile.directives')
    .directive('headerImage', function ($log, DYNENV, ConnectionState, ImgCache) {
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

        return {
            scope: {
                path: '=',
                topic: '@'
            },
            template: '<div class="header-image">' +
            '  <img img-cache="" ic-src="{{url}}" ng-if="onlineImage">' +
            '  <img img-cache="" ng-src="{{url}}" ng-if="!onlineImage">' +
            '</div>',
            link: function (scope) {

                var url = scope.path;

                if (angular.isArray(scope.path)) {
                    url = scope.path[0];
                }

                if (!url) {
                    scope.url = getRandomOfflineImage(scope.topic); // use a random image!
                    scope.onlineImage = false;
                    console.log('default image uri',scope.url);
                }
                ConnectionState.checkOnline().then(function (isOnline) {

                    ImgCache.isCached(url, function (isCached) {
                        console.log('is cached ',isCached);
                        if (!isCached && !isOnline) {
                            // we are not online and have no cached version
                            scope.url = getRandomOfflineImage(scope.topic);
                            scope.onlineImage = false;
                            console.log('offline image uri',scope.url);
                        } else {
                            // we are online or have a cached version so we use ist
                            scope.url = (DYNENV.apiEndpoint || '') + url;
                            scope.onlineImage = true;
                        }
                    });
                });
            }
        };
});
