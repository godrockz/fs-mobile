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

    .directive('headerImage', function ($log, debug, DYNENV, ConnectionState, ImageCacheService, DefaultImages) {
        return {
            scope: {
                path: '=',
                topic: '@',
                useFallbacks : '='
            },
            template: '<div class="header-image">' +
            ' <img img-x-cache="" ic-src="url" ng-if="!useFallbackImage" >' +
            ' <img img-x-cache="" ng-src="{{url}}" ng-if="useFallbackImage" >' +
            '</div>',
            link: function (scope) {
                var useFallbacks = scope.useFallbacks !== false ? true: false;
                var url = scope.path;

                if (angular.isArray(scope.path)) {
                    url = scope.path[0];
                }

                function useCachedImage(url){
                    scope.url =  (DYNENV.apiEndpoint || '') + url;
                    scope.useFallbackImage = false;
                }

                function useRandomImage(topic){
                    if(!useFallbacks){
                        scope.url = undefined;
                        scope.useFallbackImage = false;
                        return;
                    }
                    scope.url = DefaultImages.getRandomImage(topic);
                    scope.useFallbackImage = true;
                }

                if (!url) {
                    useRandomImage(scope.topic);
                    return; // no url so we use random image
                }

                useCachedImage(url);

                ImageCacheService.isCached(url).then(function (isCached) {

                    // if cached: fine

                    if (!isCached) {

                        ConnectionState.checkOnline().then(function (isOnline) {

                            // if online: ic-src will cache it

                            if (!isOnline) {
                                useRandomImage(scope.topic);
                            }
                            else {

                                // this can only be the case if image could not be get because here it should already be cached

                                ImageCacheService.cacheImage(url).then(function () {
                                    useCachedImage(url);
                                }, function () {
                                    // in case of error -> use random image
                                    $log.error('Could not get image ' + url + ' Using random.');
                                    useRandomImage(scope.topic);
                                });
                            }
                        }, function (err) {
                            $log.error('Error online check', err);
                            useRandomImage(scope.topic);
                        });
                    }

                }, function (err) {
                    $log.error('Error cache check', err);
                    useRandomImage(scope.topic);
                });

            }
        };
    });
