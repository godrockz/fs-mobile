/*global
    angular
*/
/**
 * whole data is stored under a single key
 * the key is stored in an item called 'meta_info'
 *
 *
 *
 */
'use strict';
angular.module('fsMobile.services')
    .service('dataProvider', function ($q, storageManager, $localForage, DYNENV,
                                       EndpointDetector) {

        var metaInfoKey = 'meta_info';

        // TODO : we must store data in local storage without using full api url
        //        instead we should store it under data only
        function endPoint(){
            return (DYNENV.apiEndpoint||'') + '/data';
        }

        function updateResourceData (localObjects, objects) {

            localObjects = localObjects || {};
            angular.forEach(objects, function (object) {
                console.log('updateing data ',object);
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
            return $localForage.setItem(metaInfoKey, response.$metaInfo).then(function () {
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
            },
            /**
             * updates a single property in our opject store
             * @param key  one of <events,festivalInfo,locations,news>
             * @param id object id
             * @param object object to save
             * @param property the property that should get updated
             * @returns {*}
             */
            updateSingleObject:function(key, id, object, property){

                return $localForage.getItem(metaInfoKey).then(function(metaInfo){
                    //console.log('metaInfo',metaInfo);
                    return $localForage.getItem(metaInfo.key).then(function(data){
                        //console.log('localForage data',data);
                        if(data[key] === undefined){
                            $q.reject('object not stored under given key. Currently only one of events,festivalInfo,locations,news is valid');
                        }
                        if(data[key][id] === undefined){
                            $q.reject('no instance found with id '+id) ;
                        }
                        data[key][id][property] = object[property];
                        return $localForage.setItem(metaInfo.key, data);
                    });
                });
            }
        };
    });
