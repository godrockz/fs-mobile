/**
 * check if online
 * <p/>
 * Created by Benjamin Jacob on 01.07.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.services').service('ConnectionState', function ($rootScope, $localForage, $q, $log, debug, $timeout) {

    var key = 'lastOnlineCheck';
    var maxAge = 1000 * 60 * 2; // check every n minutes

    function LastCheck(online) {
        this.date = (new Date()).getTime();
        this.online = online;
    }
    var checkProm;
    var waitMs = 1000;
    var checkUri = 'http://upsource.de/_res/images/team-bjb.png';


    function _checkOnline() {
        var deferred = $q.defer();

         if(!checkProm) {
             var result=undefined;
             var newImg = new Image();
             newImg.onload = function () {
                 $rootScope.$apply(function () {
                     if(result===undefined) {// not resolved by timeout
                         result = true;
                         deferred.resolve(true);
                     }
                     checkProm = undefined;
                 });
             };
             newImg.src = checkUri;
             $timeout(function(){
                 if(result==undefined){// no result within 1 sec
                     result=false;
                     deferred.resolve(false);//
                     checkProm=undefined;// allow next check
                 }

             },waitMs);
         }
        return deferred.promise;
    }

    function storeState(checkOnlinePromise) {
        var deferred = $q.defer();


        checkOnlinePromise.then(function (isOnline) {
            $localForage.setItem(key, JSON.stringify(new LastCheck(isOnline))).then(function () {
                debug.addData('onlineCheck', 'Results of last check', isOnline);
                deferred.resolve(isOnline);
            }, function () {
                debug.addData('onlineCheck', 'Results of last check', isOnline);
                deferred.resolve(isOnline);
            });
        }, function (err) {
            debug.addData('onlineCheck', 'Results of last check', err);
            deferred.reject(err)
        });
        return deferred.promise;
    }

    function getOnlineState(lastCheck) {

        if(!lastCheck){
            var prom = _checkOnline();
            return storeState(prom);
        }
        if (lastCheck + maxAge < (new Date()).getTime()) {
            // check now
            var prom = _checkOnline();
            return storeState(prom);

        } else {

            debug.addData('onlineCheck', 'Results of last check', lastCheck);
            return lastCheck.online;
        }
    }

    return {

        isOnline: function () {

            return $localForage.getItem(key).then(function (lastCheck) {
                try {
                    lastCheck = JSON.parse(lastCheck);
                } finally {
                    return getOnlineState(lastCheck);
                }
            }, function (err) {
                $log.error(err);
                return getOnlineState();
            });
        }
    }
});
