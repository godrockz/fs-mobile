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

                function useCachedImage(url){
                    scope.url =  (DYNENV.apiEndpoint || '') + url;
                    scope.useFallbackImage = false;
                }

                function useRandomImage(topic){
                    scope.url = getRandomOfflineImage(topic);
                    scope.useFallbackImage = true;
                }

                if (!url) {
                    useRandomImage(scope.topic);
                    return; // no url so we always use random image
                }

                ConnectionState.checkOnline().then(function (isOnline) {
                    ImageCacheService.isCached(url).then(function (isCached) {

                        if(isOnline  && !isCached ){
                            ImageCacheService.cacheImage(url).then(function(){
                                // caching was successful
                                useCachedImage(url);
                            },function(){
                                // cannot cache image maybe it does not exist any more
                                useRandomImage(scope.topic);
                            });
                        }else if(isCached ) {
                            // in any case if it was cached we use it
                            useCachedImage(url);
                        }else{
                            // and if it was not cached and not possible to add it to cache we use the random img
                            useRandomImage(scope.topic);
                        }

                    });
                });
            }
        };
    });
