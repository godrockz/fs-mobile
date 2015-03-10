
'use strict';
angular.module('fsMobile.services')

    .service('storageManager', function ($localForage, $http, $q, ENV) {

        // url can be with or without domain
        var fetch = function(url) {
            var path = urlToPathConverter(url)
            return $localForage.getItem(path).then(function(value) {
                console.log('localForage success - ' + path);
                if (!value) {
                    console.log('but value is empty');
                    value = fetchFromFile(path);
                }
                return value;
            }, function(error) {
                console.log('localForage failed - ' + path);
                return fetchFromFile(path);
            });
        };

        var fetchFromFile = function(path) {
            return $http.get(path).then(function(response) {
                console.log('fetching from json file succeeded - ' + path);
                if (response.data) {
                    $localForage.setItem(path, response.data);
                    console.log('saving to localForage was successful - ' + path);
                }
                return response.data;
            }, function(error) {
                console.log('fetching from json file failed - ' + path);
                return error;
            });
        };

        var urlToPathConverter = function(url) {
            var parser = document.createElement('a')
            parser.href = url;
            var path = parser.pathname;
            if (path == '/')
                path = '/index';
            return ENV.offlineJsonDataDirectory + path + '.json';
        };


        // isn't used yet but can be used for update functionality
        var fetchRemote = function(url) {
            if (!window.navigator.onLine)
                return $q.reject('No internet connection');

            return $http.get(url).then(function(value) {
                console.log('Remote call successful');
                return value.data;
            }, function(error, bla, blub) {
                console.log('Remote call failed');
                return fetchLocal(url);
            });
        };

        return {
            fetch: fetch
        };

    });
