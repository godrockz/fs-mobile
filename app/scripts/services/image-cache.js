/**
 * image cache handling
 * see app.js for init & settings
 * <p/>
 * Created by Benjamin Jacob on 23.02.16.
 * <p/>
 */
'use strict';
angular.module('fsMobile')
    .service('ImageCacheService', function ($rootScope, $q, ImgCache, ConnectionState, DYNENV) {

        // we need to wait for platform ready event before we can init the image-cache
        var deferred = $q.defer();
        var initPromise = deferred.promise;

        function init(){
            console.log('init imagecache');
            ImgCache.init(function() {
                ImgCache.$deferred.resolve();// resolve the angular-image-cache-wrapper promises
                deferred.resolve();
            }, function() {
                console.log('init - failed');
                ImgCache.$deferred.reject();// reject the angular-image-cache-wrapper promises
                deferred.reject();
            });

        }

        /**
         * tries to cache the given url
         * @param relativeUrl
         */
        function cacheImg(relativeUrl) {
            if (!relativeUrl) {
                return;
            }
            ConnectionState.checkOnline().then(function (isOnline) {
                if (isOnline) {
                    var absoluteUri = (DYNENV.apiEndpoint || '') + relativeUrl;
                    ImgCache.isCached(absoluteUri, function (url, cached) {
                        if (!cached) {
                            ImgCache.cacheFile(absoluteUri);
                        }
                    });
                }
            });
        }

        var svc = {
            init: init,
            /**
             * the url. to cache the image
             * @param relativeUrl
             */
            cacheImage: function (relativeUrl) {
                initPromise.then(function () {
                    console.log('cacheImage', relativeUrl);
                    cacheImg(relativeUrl);
                });
            },

            /**
             *
             * @param relativeUrl
             * @returns {*} promise
             */
            isCached: function (relativeUrl){
                var deferred = $q.defer();
                initPromise.then(function(){
                    if(relativeUrl === null || relativeUrl === undefined ){
                        deferred.resolve(relativeUrl, false);
                        return;
                    }
                    ImgCache.isCached(relativeUrl, function (path, isCached) {
                        console.log('isCached result ',path, isCached);
                        deferred.resolve(isCached);

                    });
                });
                return deferred.promise;
            }
        };
        return svc;
    });
