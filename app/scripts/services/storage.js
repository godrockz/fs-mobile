/**
 * Storage Provider
 * <p/>
 * Created by Benjamin Jacob on 26.02.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.storage',[]).factory('Storage', ['$localForage', function ($storage) {

    function StorageItem(key, id, version, data) {
        this.id = id;
        this.key = key;
        this.data = data;
        this.version = version;
    }

    /**
     * helper to work with arrays of storage items
     * @param data
     * @constructor
     */
    function StorageItems(data) {
        this.data = data || [];
    }

    StorageItems.prototype.add = function (item) {
        this.data.push(item);
    };

    StorageItems.prototype.unwrapItem = function(locator){
        this.data.sort(locator);
        return this.data.length>1 ? this.data[0].data: undefined;
    };

    StorageItems.prototype.filter = function (filter){
        this.data = this.data.filter(filter);
        return this;
    };

    StorageItems.prototype.unwrapList = function (){
        return this.data.map(function(storageItem){
            return storageItem.data;
        });
    };

    /**
     * allows selecting the latest item by version
     * @param item1
     * @param item2
     * @returns {boolean}
     * @constructor
     */
    StorageItems.LOCATOR_LATEST = function (item1,item2){
        return item1.version<item2.version;
    };

    /**
     * filters elements by id
     * @param id
     * @returns {Function}
     * @constructor
     */
    StorageItems.FILTER_BY_ID = function(id){
        return function(elem){
            if(elem.id === id){
                return true;
            }
            return false;
        };
    };

    /**
     * filter that keeps elements with greatest version
     * @returns {Function}
     * @constructor
     */
    StorageItems.FILTER_LATEST_IDS = function (){
        var idMap;
        return function (elem, idx, data) {
            if(idMap === undefined){
                idMap = {};
                angular.forEach(data,function(elem){
                    if(idMap[elem.id] === undefined || idMap[elem.id]<elem.version){
                        idMap[elem.id]=elem.version;
                    }
                });
            }

            if(idMap[elem.id] && idMap[elem.id] === elem.version){
                return true;
            }
            return false;
        };
    };


    function Storage(key) {
        if(key===undefined){
            throw 'a key is required to use the storage';
        }
        this.key = key;
    }

    /**
     * gets the latest item found under given id
     * @param [id] if omitted all latest items of the store are returned.
     * @returns {*}
     */
    Storage.prototype.get = function (id) {
        return $storage.getItem(this.key).then(function(storageItems){
            var items = new StorageItems(storageItems?storageItems:[]);
            if(id !== undefined){
                return items.filter(StorageItems.FILTER_BY_ID(id)).unwrapItem(StorageItems.LOCATOR_LATEST);
            }else{
                return items.filter(StorageItems.FILTER_LATEST_IDS()).unwrapList();
            }
        });
    };


    /**
     * adds an item to storage
     * @param data
     * @param [id] defaults to data.id
     * @param [version] defaults to data.version
     * @returns {*}
     */
    Storage.prototype.add = function (data, id, version) {
        var me = this, items, item = new StorageItem(this.key, id!==undefined ? id : data.id, version || data.version, data);

        return $storage.getItem(me.key).then(function (storageItems) {
            items =storageItems?storageItems:[];
            items.push(item);
            return $storage.setItem(me.key,items).then(function(){
                return data;
            });
        });
    };

    /**
     * removes all items
     * @returns {*}
     */
    Storage.prototype.empty = function (){
        return $storage.removeItem(this.key);
    };

    /**
     * removes any item that we have a newer version for
     */
    Storage.prototype.prune = function(){
        throw 'NotYetImplemented';
    };

    return Storage;
}]);
