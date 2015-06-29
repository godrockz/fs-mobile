/*jslint
  vars: true
*/
/*global
    angular
*/

'use strict';
angular.module('fsMobile.services')
    .service('dataProvider', function (storageManager, $localForage, AppData, ENV) {

        var url = ENV.apiEndpoint + '/data';

        var prepareData = function (data) {
            return new AppData(data);
        };

        var updateResourceData = function (localObjects, objects) {
            localObjects = localObjects || {};
            angular.forEach(objects, function (object) {
                if (object.deleted) {
                    delete localObjects[object.id];
                } else {
                    localObjects[object.id] = object;
                }
            });
            return localObjects;
        };

        var updateLocalForageData = function (response, data) {
            data = data || {};
            angular.forEach(response.data, function (objects, resourceName) {
                data[resourceName] =
                    updateResourceData(data[resourceName], objects);
            });
            data.$metaInfo = response.$metaInfo;
            return $localForage.setItem(response.$metaInfo.key, data);
        };


        return {
            getData: function () {
                return storageManager.fetchData(url)
                    .then(function (data) {
                        if (data) {
                            return data;
                        }
                        return storageManager.fetchFromFile(url).then(function (response) {
                            return updateLocalForageData(response);
                        }).catch(function (error) {
                            console.log('fetching from file failed due to', error);
                            return {};
                        });
                    })
                    .then(prepareData);
            },
            refreshData: function () {
                console.log('refresh');
                return storageManager.fetchRemote(url)
                    .then(function (response) {
                        console.log('refresh: remote data received', response);
                        return storageManager.fetchData(url)
                            .then(function (localForageData) {
                                console.log('refresh: local data fetched', localForageData);
                                return updateLocalForageData(response, localForageData)
                                    .then(prepareData);
                            });
                    });
            },
            deleteData: function () {
                return storageManager.deleteLocalData(url);
            }
        };

    });
