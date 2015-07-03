/**
 * As we won't wait for dns cahce we decided to deliver the app with 2 api endpoints
 * on a regular base the system should check which endpoint is available and configure the this endpoint as the apps api endpoint
 * this should be done when images are fetched or a update data action was done
 *
 *
 * <i>to get the correct endpoint it might be required to get the value using $injector
 * <p/>
 * Created by Benjamin Jacob on 02.07.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.services')
    .value('DYNENV', {apiEndpoint: undefined})
    .service('EndpointDetector', function (ENV, DYNENV, $http, $q, debug) {

        var lastCheckMs;
        var maxAge = 1000 * 60 * 1;// last endpoint check should not be older than


        function isOnline(url) {
            var deferred = $q.defer();
            lastCheckMs = (new Date()).getTime();
            $http.get(url).then(function () {

                deferred.resolve(true);
            }, function (e) {
                deferred.reject(e);
            });


            return deferred.promise;
        }


        return {
            discoverEndpoint: function () {
                var deferred = $q.defer();


                if (DYNENV.apiEndpoint && lastCheckMs + maxAge < (new Date()).getTime()) {
                    deferred.resolve(DYNENV);
                }

                isOnline(ENV.remoteApiEndpoint).then(function () {
                    DYNENV.apiEndpoint = ENV.remoteApiEndpoint;
                    debug.addData('endpointdetection','Discovers which endpoint should be used to query api',{endpoint:DYNENV.apiEndpoint, lasUpdate : new Date()});
                    deferred.resolve(DYNENV);
                }, function () {
                    DYNENV.apiEndpoint = ENV.localApiEndpoint;
                    debug.addData('endpointdetection','Discovers which endpoint should be used to query api',{endpoint:DYNENV.apiEndpoint, lasUpdate : new Date()});
                    deferred.resolve(DYNENV);
                });
                return deferred.promise;
            }
        };

    });
