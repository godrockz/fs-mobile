/*jslint
  nomen: true, browser: true
*/
/*global
    angular, moment
*/

'use strict';
angular.module('fsMobile.services')

    .service('storageManager', function ($localForage, $http, $q, ENV, debug) {

        function urlToPathConverter (url) {
            var parser = document.createElement('a'),
                path = null;
            parser.href = url;
            path = parser.pathname;
            if (path === '/') {
                path = '/index';
            }
            return ENV.offlineJsonDataDirectory + path + '.json';
        }

        /**
         * retrieving data from local storage
         * @param url
         * @returns {*}
         */
        function fetchData (url) {
            var path = urlToPathConverter(url);
            console.log('fetching from localForage:', path);
            return $localForage.getItem(path).then(function (data) {
                console.log('fetching from localForage succeeded', data);
                return data;
            }).catch(function (error) {
                console.log('fetching from localForage failed');
                debug.addData(
                    'fetch_data_failed',
                    'Could not access data from localForage',
                    {time: moment().format(), error: error});
                return $q.reject('Loading data failed');
            });
        }

        function fetchFromFile (url) {
            var path = urlToPathConverter(url);
            console.log('fetching from JSON', path);
            return $http.get(path).then(function (response) {
                response.$metaInfo = {
                    uri: url,
                    key: path,
                    src: 'JSON'
                };
                console.log('fetching from JSON succeeded', response);
                return response;
            }).catch(function (response) {
                debug.addData(
                    'fetch_from_file_failed',
                    'Could not access json file',
                    {url: url, time: moment().format(), response: response});
                return $q.reject('No local json file');
            });
        }

        function fetchRemote (url, ifModifiedSince) {
            var options = {};
            if (ifModifiedSince) {
                ifModifiedSince = new Date(ifModifiedSince);
                options.headers = {'If-Modified-Since': ifModifiedSince.toUTCString()};
            }
            return $http.get(url, options).then(function (data) {
                data.$metaInfo = {
                    uri: url,
                    key: urlToPathConverter(url),
                    fetched: new Date(),
                    src: 'WEB'
                };
                console.log('remote data received', data);
                return data;
            }).catch(function (response) {
                debug.addData(
                    'fetch_remote_failed',
                    'Remote http request to fetch data failed',
                    {url: url, time: moment().format(), response: response});
                return $q.reject('No internet connection');
            });
        }

        function deleteLocalData (url) {
            var path = urlToPathConverter(url),
                dataPromise = $localForage.setItem(path, undefined),
                metaInfoPromise = $localForage.setItem('meta_info', undefined);
            return $q.all(dataPromise, metaInfoPromise)
                .then(function () {
                    console.log('local data deleted');
                    return {};
                }).catch(function (error) {
                    debug.addData(
                        'delete_local_data_failed',
                        'Could delete data in localForage',
                        {time: moment().format(), error: error});
                    return $q.reject('Deleting failed');
                });
        }

        function getMetaInfo () {
            console.log('getting meta info');
            return $localForage.getItem('meta_info').then(function (data) {
                if (data) {
                    console.log('meta info received', data);
                    return data;
                }
                console.log('no meta data');
                return {};
            }, function (error) {
                console.log('meta info error', error);
            });
        }

        return {
            fetchData: fetchData,
            getMetaInfo: getMetaInfo,
            fetchRemote: fetchRemote,
            fetchFromFile: fetchFromFile,
            deleteLocalData: deleteLocalData
        };
    });
