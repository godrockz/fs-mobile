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
    .service('EndpointDetector', function (ENV, DYNENV, $http, $q, debug, $location) {

        var lastCheckMs,
            maxAge = 1000 * 60,// last endpoint check should not be older than
            cnt=0;

        function isOnline(url) {
            var deferred = $q.defer();
            cnt++;
            lastCheckMs = (new Date()).getTime();
            $http.get(url+'/').then(function () {
                debug.addData(
                    'endpointdetection1',
                    'raw',
                    {url: url, result: true, location: $location.absUrl()});
                deferred.resolve(true);
            }, function (e) {
                debug.addData(
                    'endpointdetection1',
                    'raw',
                    {url: url, result: 'was error', err: e, location: $location.absUrl()});
                deferred.reject(e);
            });
            return deferred.promise;
        }


        return {
            discoverEndpoint: function () {
                var deferred = $q.defer();

                if (DYNENV.apiEndpoint && lastCheckMs + maxAge < (new Date()).getTime()) {
                    debug.addData(
                        'endpoint',
                        'min wait before next check is ' + maxAge + ' ms',
                        {using: DYNENV.apiEndpoint, location: $location.absUrl()});
                    deferred.resolve(DYNENV);
                } else {
                    debug.addData(
                        'endpoint',
                        'lastcheck schon lange her, bisheriger endpoint',
                        {using:DYNENV.apiEndpoint});
                    isOnline(ENV.localApiEndpoint).then(function () {
                        DYNENV.apiEndpoint = ENV.localApiEndpoint;
                        debug.addData(
                            'endpointdetection',
                            'Discovers which endpoint should be used to query api',
                            {checkCnt: cnt,
                             endpoint: DYNENV.apiEndpoint,
                             lasUpdate: new Date(),
                             location: $location.absUrl()});
                        deferred.resolve(DYNENV);
                    }, function () {
                        DYNENV.apiEndpoint = ENV.remoteApiEndpoint;
                        debug.addData(
                            'endpointdetection',
                            'Discovers which endpoint should be used to query api',
                            {checkCnt: cnt,
                             endpoint: DYNENV.apiEndpoint,
                             location: $location.absUrl(),
                             lasUpdate: new Date()});
                        deferred.resolve(DYNENV);
                    });
                }
                return deferred.promise;
            }
        };

    });
