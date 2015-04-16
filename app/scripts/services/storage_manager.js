'use strict';
angular.module('fsMobile.services')

    .service('storageManager', function ($localForage, $http, $q, ENV) {

        // url can be with or without domain
        var fetchData = function (url) {
            // first try to load required resource via rest
            var path = urlToPathConverter(url);

            return fetchRemote(url).catch(function(err){
                // it was not possible
                console.log('web failed due to',err);
                return $localForage.getItem(path).then(function(data){
                    if (!data) {
                        console.log('localStorage failed due to empty data');
                        return $q.reject('got data but data is empty');
                    }
                    return data;
                });
            }).catch(function(err){
                console.log('error with local storage',err);
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
