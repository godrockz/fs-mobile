/**
 * Simple Rest Client
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */

/*jslint
    nomen: true
*/
/*global
    angular
*/

'use strict';
angular.module('fsMobile.rest', ['ngResource'])

    .config(['$resourceProvider', function ($resourceProvider) {
        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;
    }])

    .factory('RestClient', function RestClient($q, $log, $resource) {

        function _call(url, uriParams, object, method) {
            var deferred = $q.defer(),
                headers = {
                    'Content-Type': 'application/json'
                };

            $resource(url, uriParams, {
                doRequest: {
                    'method': method,
                    headers: headers
                }
            }).doRequest(object).$promise.then(function (result) {
                deferred.resolve(result);
            }, function (error) {
                $log.error(error);
                deferred.reject(error);
            });
            return deferred.promise;
        }

        var svc = {
            load: function (url, params) {
                return _call(url, params, undefined, 'GET');
            }
        };
        return svc;
    });
