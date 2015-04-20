
'use strict';
angular.module('fsMobile.services')

    .service('dataUpdater', function ($localForage, $http, $q, ENV) {

        var run = function() {
            return _fetchRemote(ENV.apiEndpoint + '/data').then(function(response) {
                if (!response) return;
                angular.forEach(response, function(objects, resource_name) {
                    $localForage.getItem(resource_name).then(function(localObjects) {
                        localObjects = JSON.parse(localObjects);
                        _updateLocalForageData(resource_name, localObjects, objects);
                    });
                });
            });
        };

        var _updateLocalForageData = function(resource_name, objects, localObjects) {
            console.log('localForage success - ' + resource_name);
            localObjects = localObjects || {};
            angular.forEach(objects, function(object) {
                if (object.deleted) {
                    delete localObjects[object.id];
                } else {
                    localObjects[object.id] = object;
                }
            });
            $localForage.setItem(resource_name, JSON.stringify(localObjects));
        };

        var _fetchRemote = function(url) {
            if (!window.navigator.onLine)
                return $q.reject('No internet connection');

            return $http.get(url).then(function(value) {
                console.log('Remote call successful');
                return value.data;
            }, function(error, bla, blub) {
                console.log('Remote call failed');
            });
        };

        return {
            run: run
        };

    });
