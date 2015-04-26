/**
 * TODO: Documentation
 * <p/>
 * Created by Benjamin Jacob on 16.04.15.
 * <p/>
 * © 2015 upSource GmbH, all rights reserved.
 */
'use strict';
angular.module('fsMobile.services')
.service('dataProvider', function($q, storageManager,  $localForage, Resource, ENV) {

    var prepareData = function(data) {
        return _.mapValues(data, function(value, key) {
            if (key == '$metaInfo') return value;
            return new Resource(value)
        });
    };

    var updateLocalForageData = function(response, data) {
        console.log('refresh: local data fetched', data);
        angular.forEach(response.data, function(objects, resourceName) {
            data[resourceName] =
                updateResourceData(data[resourceName], objects);
        });
        data.$metaInfo = response.$metaInfo;
        return $localForage.setItem(response.$metaInfo.key, JSON.stringify(data))
            .then(function(data) {
                return prepareData(JSON.parse(data))
            });
    };

    var updateResourceData = function(localObjects, objects) {
        localObjects = localObjects || {};
        angular.forEach(objects, function(object, id) {
            // TODO: Backend has to provide ids for each object
            object.id = object.id || id
            if (object.deleted) {
                delete localObjects[object.id];
            } else {
                localObjects[object.id] = object;
            }
        });
        return localObjects;
    };

    return {
        getData: function(){
            return storageManager.fetchData(ENV.apiEndpoint + '/data')
                .then(prepareData);
        },
        refreshData: function() {
            console.log('refresh');
            return storageManager.fetchRemote(ENV.apiEndpoint + '/data')
                .then(function(response) {
                    console.log('refresh: remote data received', response);
                    return storageManager.fetchData(ENV.apiEndpoint + '/data')
                        .then(function(localForageData) {
                            return updateLocalForageData(response, localForageData);
                        });
                });
        },
        deleteData: function (){
            return storageManager.deleteLocalData(ENV.apiEndpoint + '/data')
        }
    };

});
