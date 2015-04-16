/**
 * TODO: Documentation
 * <p/>
 * Created by Benjamin Jacob on 16.04.15.
 * <p/>
 * © 2015 upSource GmbH, all rights reserved.
 */
angular.module('fsMobile.services').service('dataProvider',function($q, storageManager,ENV){

    var indexRO;
    var dataRO;

    var svc = {
        updateData: function(){
            return storageManager.fetchData(ENV.apiEndpoint).then(function (indexRo) {
                indexRO = indexRO;
                console.log('indexRo',indexRo);
                var dataRoUrl = indexRo._links.data.href;
                return storageManager.fetchData(dataRoUrl).then(function (data) {
                    dataRO = data;
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
                return $q.when(dataRO);
            }else{
                return svc.updateData();
            }
        }
    };
    return svc;

});
