/**
 * check if online
 * <p/>
 * Created by Benjamin Jacob on 01.07.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.services').service('ConnectionState', function ($localForage, $q, $log, debug) {

    var key = 'lastOnlineCheck';
    var maxAge = 1000 * 60 * 2; // check every n minutes

    function LastCheck(online) {
        this.date = (new Date()).getTime();
        this.online = online;
    }


    function _checkOnline() {
        var deferred = $q.defer();
        deferred.resolve(false);
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

        if (lastCheck && lastCheck + maxAge < (new Date()).getTime()) {
            // check now
            var prom = _checkOnline();
            return storeState(prom);

        } else {
            debug.addData('onlineCheck', 'Results of last check', lastCheck);
            var prom = _checkOnline();
            return storeState(prom);
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
