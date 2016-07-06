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
    .service('dataProvider', function ($q, storageManager, $localForage, DYNENV, EndpointDetector) {

        var metaInfoKey = 'meta_info';

        /**
         * gets the current api endpoint
         * @returns {string}
         */
        function endPoint(){
            return (DYNENV.apiEndpoint||'') + '/v16/data';
        }

        /**
         * merge any object of the given newObjects into the list of localObjects.
         * This includes:
         *  - removing deleted and archived objects
         *  - merge new data/updates with existing object instances
         * @param localObjects - currently stored objects
         * @param newObjects - new objects received
         * @returns {*|{}}
         */
        function updateResourceData (localObjects, newObjects) {

            localObjects = localObjects || {};
            angular.forEach(newObjects, function (newObject) {
                console.log('updating data ',newObject);
                if (newObject.deleted ) {
                    delete localObjects[newObject.id];
                } else if(newObject.archived){
                    // handle archived objects same as deleted
                    delete localObjects[newObject.id];
                } else {
                    // as we add additional information to objects in our storage
                    // we need to merge them. (additionally: readState for news, liked events, ...)
                    var existingObject = localObjects[newObject.id] || {};
                    var mergedObject = angular.extend(existingObject,newObject);
                    localObjects[newObject.id] = mergedObject;
                }
            });
            return localObjects;
        }

        /**
         * mergeS fresh data from response into old data given as data
         * @param response new data
         * @param data current data
         * @returns {*}
         */
        function updateLocalForageData (response, data) {
            data = data || {};
            angular.forEach(response.data, function (objects, resourceName) {
                if (angular.isArray(objects)) {
                    data[resourceName] =
                        updateResourceData(data[resourceName], objects);
                }
                else {
                    data[resourceName] = objects;
                }

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
                console.log('Refresh data ...');
                return EndpointDetector.discoverEndpoint().then(function () {
                    return storageManager.fetchRemote(endPoint(), ifModifiedSince).then(function (data) {
                        if (!ifModifiedSince) {
                            console.log('Received new data. Deleting local data ...');
                            storageManager.deleteLocalData(endPoint());
                        }
                        return data;
                    });
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
