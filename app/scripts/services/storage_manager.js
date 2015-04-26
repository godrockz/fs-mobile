'use strict';
angular.module('fsMobile.services')

    .service('storageManager', function ($localForage, $http, $q, ENV) {

        // url can be with or without domain
        var fetchData = function (url) {
            var path = urlToPathConverter(url);

            return $localForage.getItem(path).then(function(data){
                data = data || '{}';
                data =  JSON.parse(data);
                // make sure that we don't have old array format
                if (angular.isArray(data.locations)) data = {};
                return data
            }).catch(function(err){
                console.log('error with local storage',err);
                // TODO: I still need to update this method
                // return fetchFromFile(path);
                return
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
                console.log('fetching from file failed due to',error);
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
                data.$metaInfo.src='WEB';
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
            deleteLocalData: deleteLocalData
        };
    });
