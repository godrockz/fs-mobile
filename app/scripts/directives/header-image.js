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

                        ImgCache.$promise.then(function() {
                            ImgCache.isCached(src, function(path, success) {
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
                        loadImg('src', el, scope.icSrc);
                    });

                    attrs.$observe('icBg', function(src) {
                        loadImg('bg', el, src);

                    });

                }
            };
        }])

    .directive('headerImage', function ($log, DYNENV, ConnectionState, ImageCacheService, DefaultImages) {
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
                    console.log('using random image',topic);
                    scope.url = DefaultImages.getRandomImage(topic);
                    scope.useFallbackImage = true;
                }

                // always display random image
                useRandomImage(scope.topic);
                if (!url) {
                    return; // no url so we use random image
                }

                ConnectionState.checkOnline().then(function (isOnline) {
                    ImageCacheService.isCached(url).then(function (isCached) {

                        if(isOnline  && !isCached ){
                            ImageCacheService.cacheImage(url).then(function(){
                                // caching was successful
                                useCachedImage(url);
                            });// in case of error -> random image is left
                        }else if(isCached ) {
                            // in any case if it was cached we use it
                            useCachedImage(url);
                        }
                        // any other case, random image is left in dispaly

                    });
                });
            }
        };
    });
