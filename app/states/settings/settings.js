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
                controller: function ($scope, AVAILABLE_LANGUAGES, $translate) {
                    $scope.view = {
                        availableLanguages : AVAILABLE_LANGUAGES,
                        selectedLanguage : $translate.use()
                    };
                    console.log('scope . available langs ',$scope.view.availableLanguages,'selected',$scope.view.selectedLanguage);
                    $scope.$watch('view.selectedLanguage', function () {
                        console.log('selectedLanguage changed:',$scope.view.selectedLanguage);
                        if($scope.view.selectedLanguage !== $translate.use()) {
                            $translate.use($scope.view.selectedLanguage);
                        }
                    });
                }
            }
        }
    });
});
