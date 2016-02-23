/**
 * check if online
 * <p/>
 * Created by Benjamin Jacob on 01.07.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.services').service('ConnectionState', function (DYNENV, EndpointDetector, $http, $rootScope, $localForage, $q, $log, debug, $timeout) {

    var key = 'lastOnlineCheck';
    var maxAge = 1000 * 60 * 2; // check every n minutes

    function endpoint(){
        EndpointDetector.discoverEndpoint();
        return (DYNENV.apiEndpoint||'') + '/';
    }

    function LastCheck(online) {
        /**
         * contains a time stamp of last check
         * @type {number}
         */
        this.date = (new Date()).getTime();
        this.online = online;
    }

    var checkProm;
    var waitMs = 1000;

    function _checkOnline() {
        var deferred = $q.defer();

        if (!checkProm) {
            var result;
            $http.get(endpoint()).then(function () {

                if (result === undefined) {// not resolved by timeout
                    result = true;
                    deferred.resolve(true);
                }
                checkProm = undefined;

            }, function () {
                if (result === undefined) {// no result within 1 sec
                    result = false;
                    deferred.resolve(false);//
                    checkProm = undefined;// allow next check
                }
            });

            $timeout(function () {
                if (result === undefined) {// no result within 1 sec
                    result = false;
                    deferred.resolve(false);//
                    checkProm = undefined;// allow next check
                }

            }, waitMs);
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
            deferred.reject(err);
        });
        return deferred.promise;
    }

    function getOnlineState(lastCheck) {

        if (!lastCheck) {
            return storeState(_checkOnline());
        }

        if (lastCheck.date + maxAge < (new Date()).getTime()) {
            // check now
            return storeState(_checkOnline());

        } else {

            debug.addData('onlineCheck', 'Results of last check', lastCheck);
            return lastCheck.online;
        }
    }

    return {

        /**
         * checks if the system is online
         * @returns {*}
         */
        checkOnline: function () {

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
    };
});
