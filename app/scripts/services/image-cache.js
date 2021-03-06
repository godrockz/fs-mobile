/**
 * image cache handling
 * see app.js for init & settings
 * <p/>
 * Created by Benjamin Jacob on 23.02.16.
 * <p/>
 */
'use strict';
angular.module('fsMobile')
    .service('ImageCacheService', function (debug, $rootScope, $q, ImgCache, ConnectionState, DYNENV) {

        // we need to wait for platform ready event before we can init the image-cache
        var deferred = $q.defer();
        var initPromise = deferred.promise;

        function init() {

            ImgCache.options = {
                debug: false,                   /* call the log method ? */
                localCacheFolder: 'imgcache',   /* name of the cache folder */
                useDataURI: false,              /* use src="data:.."? otherwise will use src="filesystem:.." */
                chromeQuota: 10 * 1024 * 1024,  /* allocated cache space : here 10MB */
                usePersistentCache: true,       /* false = use temporary cache storage */
                cacheClearSize: 0,              /* size in MB that triggers cache clear on init, 0 to disable */
                headers: {},                    /* HTTP headers for the download requests -- e.g: headers: { 'Accept': 'application/jpg' } */
                skipURIencoding: false          /* enable if URIs are already encoded (skips call to sanitizeURI) */
            };

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
                        } else {
                            deferred.resolve();
                        }
                    }, function(e){
                        deferred.reject(e);
                    });
                }else{
                    deferred.reject('not online');
                }
            }, deferred.reject);
            return deferred.promise;
        }

        /**
         * queue for cacheImage function
         */
        var cacheImgQueue;

        var svc = {
            init: init,
            /**
             * the url. to cache the image
             * @param relativeUrl
             * @return promise;
             */
            cacheImage: function (relativeUrl) {
                var deferred = $q.defer();
                return initPromise.then(function () {
                    if(!cacheImgQueue) {
                        cacheImgQueue = $q.when();
                    }
                    cacheImgQueue['finally'](function (){
                        cacheImg(relativeUrl)
                            .then(deferred.resolve, deferred.reject);
                    });
                    cacheImgQueue = deferred.promise;
                    return cacheImgQueue;
                });
            },

            /**
             *
             * @param relativeUrl
             * @returns {*} promise
             */
            isCached: function (relativeUrl) {
                var deferred = $q.defer();
                initPromise.then(function () {
                    if (relativeUrl === null || relativeUrl === undefined) {
                        deferred.resolve(relativeUrl, false);
                        return;
                    }
                    var absoluteUri = (DYNENV.apiEndpoint || '') + relativeUrl;
                    ImgCache.isCached(absoluteUri, function (path, isCached) {
                        deferred.resolve(isCached);
                    });
                });
                return deferred.promise;
            },

            /**
             * clears the cache
             * @returns {*}
             */
            clearCache: function (){
                var deferred = $q.defer();
                ImgCache.clearCache(deferred.resolve,
                deferred.reject);
                return deferred.promise;
            }
        };
        return svc;
    });
