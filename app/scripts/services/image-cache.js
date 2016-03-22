/**
 * image cache handling
 * see app.js for init & settings
 * <p/>
 * Created by Benjamin Jacob on 23.02.16.
 * <p/>
 */
'use strict';
angular.module('fsMobile')
    .service('ImageCacheService', function ($q, ImgCache, ConnectionState, DYNENV) {

        // init
        var deferred = $q.defer();
        var init = deferred.promise;
        ImgCache.$init(function(){
            deferred.resolve();
        },function(){
            deferred.reject();
        });

        function cacheImg(relativeUrl) {
            if (!relativeUrl) {
                return;
            }
            ConnectionState.checkOnline().then(function (isOnline) {
                if (isOnline) {
                    var absoluteUri = (DYNENV.apiEndpoint || '') + relativeUrl;
                    ImgCache.isCached(absoluteUri, function (cached) {
                        if (!cached) {
                            ImgCache.cacheFile(absoluteUri);
                        }
                    });
                }
            });
        }

        var svc = {
            init: function (){
              // currently does nothing.
            },
            /**
             * the url. to cache the image
             * @param relativeUrl
             */
            cacheImage: function (relativeUrl) {
                init.then(function () {
                    cacheImg(relativeUrl);
                });
            }
        };
        return svc;
    });
