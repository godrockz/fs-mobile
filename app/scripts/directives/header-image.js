'use strict';
angular.module('fsMobile.directives')

        .directive('imgXCache', ['ImgCache', function(ImgCache) {

            return {
                restrict: 'A',
                scope: {
                    icBg: '=',
                    icSrc: '='
                },
                link: function(scope, el, attrs) {

                    var setImg = function(type, el, src) {

                        ImgCache.getCachedFileURL(src, function(src, dest) {
                            console.log('set img tags src',src,dest);
                            if(type === 'bg') {
                                el.css({'background-image': 'url(' + dest + ')' });
                            } else {
                                el.attr('src', dest);
                            }
                        });
                    };


                    var loadImg = function(type, el, src) {
                        if(src===undefined){
                            return;
                        }

                        console.log('load image');
                        ImgCache.$promise.then(function() {
                            console.log('imageCache promise ');
                            ImgCache.isCached(src, function(path, success) {
                                console.log('isCached',success,'on', path);
                                if (success) {
                                    setImg(type, el, src);
                                } else {
                                    ImgCache.cacheFile(src, function() {
                                        setImg(type, el, src);
                                    });
                                }

                            });
                        });
                    };

                    scope.$watch('icSrc', function() {
                        console.log('modified icSrc',scope.icSrc);
                        loadImg('src', el, scope.icSrc);

                    });

                    attrs.$observe('icBg', function(src) {

                        loadImg('bg', el, src);

                    });

                }
            };
        }])

    .directive('headerImage', function ($log, DYNENV, ConnectionState, ImageCacheService) {
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
            ' <img img-x-cache="" ic-src="url" ng-if="!useFallbackImage" >' +
            ' <img img-x-cache="" ng-src="{{url}}" ng-if="useFallbackImage" >' +
            '</div>',
            link: function (scope) {

                var url = scope.path;

                if (angular.isArray(scope.path)) {
                    url = scope.path[0];
                }

                if (!url) {
                    console.log('url',url);
                    scope.url = getRandomOfflineImage(scope.topic); // use a random image!
                    scope.onlineImage = false;
                    console.log('default image uri', scope.url);
                }

                ConnectionState.checkOnline().then(function (isOnline) {
                    ImageCacheService.isCached(url).then(function (isCached) {
                        console.log('is cached ', isCached, isOnline);
                        if (!isCached && !isOnline) {
                            // we are not online and have no cached version
                            scope.url = getRandomOfflineImage(scope.topic);
                            scope.useFallbackImage = true;
                            console.log('use offline image uri', scope.url);
                        } else {
                            // we are online or have a cached version so we use it
                            scope.url =  (DYNENV.apiEndpoint || '') + url;
                            scope.useFallbackImage = false;
                            console.log('use cached / online image url ',scope.url);
                        }
                    });
                });
            }
        };
    });
