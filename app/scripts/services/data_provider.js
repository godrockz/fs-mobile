/*jslint
  vars: true
*/
/*global
    angular
*/

'use strict';
angular.module('fsMobile.services')
    .service('dataProvider', function (storageManager, $localForage, AppData, DYNENV) {
        // TODO : we must store data in local storage without using full api url instead we should store it under data only
        function endPoint(){
            return DYNENV.apiEndpoint + '/data';
        };

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
            console.log('stored data to XXX:',response.$metaInfo.key);
            return $localForage.setItem(response.$metaInfo.key, data);
        };


        return {
            getData: function () {
                return storageManager.fetchData(endPoint())
                    .then(function (data) {
                        if (data) {
                            console.log('got data from fetchDAtaMEthod',data);
                            return data;
                        }
                        return storageManager.fetchFromFile(endPoint()).then(function (response) {
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
                return storageManager.fetchRemote(endPoint())
                    .then(function (response) {
                        console.log('refresh: remote data received', response);
                        return storageManager.fetchData(endPoint())
                            .then(function (localForageData) {
                                console.log('refresh: local data fetched', localForageData);
                                return updateLocalForageData(response, localForageData)
                                    .then(prepareData);
                            });
                    });
            },
            deleteData: function () {
                return storageManager.deleteLocalData(endPoint());
            }
        };

    });
