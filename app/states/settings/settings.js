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
                controller: function ($scope, AVAILABLE_LANGUAGES, $translate, $rootScope) {
                    $scope.view = {
                        availableLanguages : AVAILABLE_LANGUAGES,
                        selectedLanguage : $translate.use()
                    };
                    $scope.$watch('view.selectedLanguage', function () {
                        if($scope.view.selectedLanguage !== $translate.use()) {
                            $translate.use($scope.view.selectedLanguage);
                            $rootScope.$emit('translationChanged');
                        }
                    });
                }
            }
        }
    });
});
