'use strict';
angular.module('fsMobile.services')

    .service('storageManager', function ($localForage, $http, $q, ENV) {

        // url can be with or without domain
        var fetchData = function (url) {
            var path = urlToPathConverter(url);
            console.log('fetching from localForage:', path);
            return $localForage.getItem(path).then(function(data) {
                console.log('fetching from localForage succeeded');
                if (!data) {
                    console.log('localStorage: no data');
                }
                return data;
            });
        };

        var fetchFromFile = function (url) {
            var path = urlToPathConverter(url);
            console.log('fetching from JSON',path);
            return $http.get(path).then(function (response) {
                console.log('fetching from JSON succeeded');
                response.$metaInfo = {
                    uri: url,
                    key: path,
                    src: 'JSON'
                };
                return response;
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
                    fetched : new Date(),
                    src: 'WEB'
                };
                return data;
            });
        };

        var deleteLocalData = function (url) {
            var path = urlToPathConverter(url);
            return $localForage.setItem(path, undefined)
                .then(function() {
                    console.log('local data deleted');

                });
        };

        return {
            fetchData: fetchData,
            fetchRemote: fetchRemote,
            fetchFromFile: fetchFromFile,
            deleteLocalData: deleteLocalData
        };
    });
