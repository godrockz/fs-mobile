/**
 * enriches retrieved data with accessor functions
 * <p/>
 * Created by Benjamin Jacob on 09.03.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.services').service('dataProvider', function (storageManager, ucFirstFilter) {


    function fetchInvocation(url) {
        return function () {
            return fetchData(url);
        };
    }

    function wrapInvocations(data){
        if (data._links) {
            data.$load = {};
            angular.forEach(data._links, function (link, key) {
                data.$load[ key] = fetchInvocation(link.href);
            });
        }else{
            console.log('got',data);
        }
    }

    function fetchData(url) {
        return storageManager.fetch(url).then(function (data) {
            if (data._links) {
                wrapInvocations(data);
            }else if (angular.isArray(data)){
                angular.forEach(data,function(entry){
                    wrapInvocations(entry);
                });
            }
            return data;
        });
    }

    var svc = {
        fetch: fetchData
    };
    return svc;
});
