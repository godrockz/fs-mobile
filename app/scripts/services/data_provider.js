/*global
    angular
*/

'use strict';
angular.module('fsMobile.services')
    .service('dataProvider', function (storageManager, $localForage, DYNENV,
                                       EndpointDetector) {
        // TODO : we must store data in local storage without using full api url
        //        instead we should store it under data only
        function endPoint(){
            return (DYNENV.apiEndpoint||'') + '/data';
        }

        function updateResourceData (localObjects, objects) {
            localObjects = localObjects || {};
            angular.forEach(objects, function (object) {
                if (object.deleted ) {
                    delete localObjects[object.id];
                } else if(object.archived){
                    // handle archived objects same as deleted
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
            return $localForage.setItem('meta_info', response.$metaInfo).then(function () {
                return $localForage.setItem(response.$metaInfo.key, data);
            });
        }

        return {
            /**
             * fetch from localStorage
             * or if fails from from file
             * @returns {*}
             */
            getData: function () {
                return storageManager.fetchData(endPoint())
                    .then(function (data) {
                        if (data) { return data; }
                        return storageManager.fetchFromFile(endPoint()).then(function (resp) {
                            return updateLocalForageData(resp);
                        }).catch(function () {
                            return {};
                        });
                    });
            },

            /**
             * fetches from remote
             *
             * @param ifModifiedSince
             * @returns {*}
             */
            refreshData: function (ifModifiedSince) {
                console.log('refresh');
                return EndpointDetector.discoverEndpoint().then(function () {
                    return storageManager.fetchRemote(endPoint(), ifModifiedSince);
                }).then(function (response) {
                    return storageManager.fetchData(endPoint())
                        .then(function (localForageData) {
                            return updateLocalForageData(response, localForageData);
                        });
                });
            },
            getMetaInfo: function () {
                return storageManager.getMetaInfo();
            },
            deleteData: function () {
                return storageManager.deleteLocalData(endPoint());
            }
        };

    });
