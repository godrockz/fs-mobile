/**
 * Settings page
 * <p/>
 * Created by Benjamin Jacob on 20.04.15.
 * <p/>
 */

/*jslint
  plusplus: true
*/
/*global
    angular
*/

'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'states/settings/settings.html',
                controller: function ($scope, AVAILABLE_LANGUAGES, $translate,
                                      $rootScope, debug, $q, $ionicHistory,
                                      $ionicLoading, ENV, LanguageService) {
                    $scope.view = {
                        availableLanguages: AVAILABLE_LANGUAGES,
                        selectedLanguage: $translate.use(),
                        jobName : ENV.jobName ||'?',
                        version : ENV.version ||'?'
                    };
                    $scope.$watch('view.selectedLanguage', function () {


                        if ($scope.view.selectedLanguage &&
                            $scope.view.selectedLanguage !== $translate.use()) {
                            LanguageService.setLanguage($scope.view.selectedLanguage);
                        }
                    });

                    $scope.refresh = function() {
                        $ionicLoading.show({template: 'Updating...'});
                        $scope.refreshData(true);
                    };

                    // DEBUGGING INFORMATION
                    $scope.debug = {cnt: 0};
                    $scope.onDebug = function () {
                        $scope.debug.cnt++;
                        if($scope.debug.cnt>10){
                            debug.setDebug(true);
                        }
                    };
                    $scope.stopdebug = function(){
                        debug.setDebug(false);
                        $scope.debug.cnt = 0;
                    };

                    debug.addData('translate', '$translate.use()', $translate.use());
                    $rootScope.$on('translationChanged', function () {
                        debug.addData('translate', '$translate.use()', $translate.use());
                    });
                }
            }
        }
    });
});
