/**
 * TODO: Documentation
 * <p/>
 * Created by Benjamin Jacob on 16.04.15.
 * <p/>
 * © 2015 upSource GmbH, all rights reserved.
 */
'use strict';
angular.module('fsMobile.services').service('dataProvider',function($q, storageManager,ENV){

    var indexRO;
    var dataRO;

    var svc = {
        updateData: function(){
            return storageManager.fetchData(ENV.apiEndpoint).then(function (indexRo) {
                indexRO = indexRO;
                console.log('indexRo',indexRo);
                var dataRoUrl = indexRo.data._links.data.href;
                console.log('retrieve from ',dataRoUrl);
                return storageManager.fetchData(dataRoUrl).then(function (data) {
                    console.log('got data ',data);
                    dataRO = data.data;
                    return  dataRO;
                });
            });
        },
        getIndexRO: function(){

            if(indexRO){
                return $q.when(indexRO);
            }else{
                return svc.updateData();
            }
        },
        getAppDataRo: function (){
            if(dataRO){
                console.log('already in cache',dataRO);
                return $q.when(dataRO);
            }else{
                console.log('run update Data');
                return svc.updateData();
            }
        }
    };
    return svc;

});
