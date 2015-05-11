/**
 * Settings page
 * <p/>
 * Created by Benjamin Jacob on 20.04.15.
 * <p/>
  */
'use strict';
angular.module('fsMobile.states').config(function ($stateProvider) {
    $stateProvider.state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'states/settings/settings.html',
                controller: function ($scope, AVAILABLE_LANGUAGES, $translate, $rootScope, debug, $q) {
                    $scope.view = {
                        availableLanguages : AVAILABLE_LANGUAGES,
                        selectedLanguage : $translate.use()
                    };
                    $scope.$watch('view.selectedLanguage', function () {
                        if($scope.view.selectedLanguage !== $translate.use()) {
                            $q.when($translate.use($scope.view.selectedLanguage)).then(function(){
                                $rootScope.$emit('translationChanged');
                            });
                        }
                    });

                    // DEBUGGING INFORMATION
                    $scope.debug = {cnt:0};
                    $scope.onDebug = function () {
                        $scope.debug.cnt++;
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
