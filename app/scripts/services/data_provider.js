/*global
    angular
*/

'use strict';
angular.module('fsMobile.services')
    .service('dataProvider', function (storageManager, $localForage, AppData, DYNENV) {
        // TODO : we must store data in local storage without using full api url
        //        instead we should store it under data only
        function endPoint(){
            return (DYNENV.apiEndpoint||'') + '/data';
        }

        function  prepareData (data) {
            return new AppData(data);
        }

        function updateResourceData (localObjects, objects) {
            localObjects = localObjects || {};
            angular.forEach(objects, function (object) {
                if (object.deleted) {
                    delete localObjects[object.id];
                } else {
                    localObjects[object.id] = object;
                }
            });
            return localObjects;
        }

        function updateLocalForageData (response, data) {
            data = data || {};
            angular.forEach(response.data, function (objects, resourceName) {
                data[resourceName] =
                    updateResourceData(data[resourceName], objects);
            });
            data.$metaInfo = response.$metaInfo;
            return $localForage.setItem(response.$metaInfo.key, data);
        }

        return {
            getData: function () {
                return storageManager.fetchData(endPoint())
                    .then(function (data) {
                        if (data) { return data; }
                        return storageManager.fetchFromFile(endPoint()).then(function (resp) {
                            return updateLocalForageData(resp);
                        }).catch(function () {
                            return {};
                        });
                    })
                    .then(prepareData);
            },
            refreshData: function (ifModifiedSince) {
                console.log('refresh');
                return storageManager.fetchRemote(endPoint(), ifModifiedSince)
                    .then(function (response) {
                        return storageManager.fetchData(endPoint())
                            .then(function (localForageData) {
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
