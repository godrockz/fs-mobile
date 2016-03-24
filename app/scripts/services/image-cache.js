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
            ImgCache.$init();

            // wait for the angular directive to be ready.
            ImgCache.$deferred.promise.then(function () {
                deferred.resolve();
            }, function () {
                deferred.reject();
            });

        }

        /**
         * tries to cache the given url
         * @param relativeUrl
         * @return promise
         */
        function cacheImg(relativeUrl) {
            var deferred = $q.defer();
            if (!relativeUrl) {
                deferred.reject();
                return deferred.promise;
            }
            ConnectionState.checkOnline().then(function (isOnline) {
                if (isOnline) {
                    var absoluteUri = (DYNENV.apiEndpoint || '') + relativeUrl;
                    ImgCache.isCached(absoluteUri, function (url, cached) {
                        if (!cached) {
                            ImgCache.cacheFile(absoluteUri, deferred.resolve, deferred.reject);
                        }else{
                            deferred.resolve();
                        }
                    });
                }
            });
            return deferred.promise;
        }

        var svc = {
            init: init,
            /**
             * the url. to cache the image
             * @param relativeUrl
             * @return promise;
             */
            cacheImage: function (relativeUrl) {
                return initPromise.then(function () {
                    console.log('cacheImage', relativeUrl);
                    return cacheImg(relativeUrl);
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
                        deferred.resolve(isCached);
                    });
                });
                return deferred.promise;
            }
        };
        return svc;
    });
