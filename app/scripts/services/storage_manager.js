'use strict';
angular.module('fsMobile.services')

    .service('storageManager', function ($localForage, $http, $q, ENV) {

        var fetch = function(resource_name) {
            return $localForage.getItem(resource_name).then(function(value) {
                console.log('localForage success - ' + resource_name);
                if (!value) {
                    console.log('but value is empty');
                    // value = fetchFromFile(path);
                }
                return value;
            }, function(error) {
                console.log('localForage failed - ' + resource_name);
                return fetchFromFile(path);
            });
        };

        var fetchFromFile = function (path) {
            console.log('fetching from ',path);
            return $http.get(path).then(function (response) {
                console.log('fetching from json file succeeded - ' + path);
                if (response.data) {
                    $localForage.setItem(path, response.data);
                    console.log('saving to localForage was successful - ' + path);
                }
                return response.data;
            }, function (error) {
                console.log('fetching from file failed due to',err);
                return error;
            });
        };

        var urlToPathConverter = function (url) {
            var parser = document.createElement('a');
            parser.href = url;
            var path = parser.pathname;
            if (path === '/') {
                path = '/index';
            }
            return ENV.offlineJsonDataDirectory + path + '.json';
        };

        var fetchRemote = function (url) {
            if (!window.navigator.onLine) {
                return $q.reject('No internet connection');
            }

            return $http.get(url).then(function (data) {
                data.$metaInfo={
                    uri: url,
                    key: urlToPathConverter(url),
                    fetched : new Date()
                };
                $localForage.setItem(data.$metaInfo.key,data);
                data.$metaInfo.src='WEB';
                return data;
            });
        };

        return {
            fetchData: fetchData
        };
    });
