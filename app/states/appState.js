'use strict';
angular.module('fsMobile.controllers', []).config(function ($stateProvider) {
    var defaultLanguage='en';
    function guessLanguage(langIdentifier){
        if (langIdentifier && langIdentifier.length >= 5 && langIdentifier.indexOf('_') !== -1) {
            var parts = langIdentifier.split('_');
            if(parts.length > 0){
                return parts[0];
            }
        }
        return defaultLanguage;
    }

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        resolve:{
            appData:function(dataProvider, $rootScope){
                return dataProvider.getData().finally(function(){
                    $rootScope.$broadcast('scroll.refreshComplete');
                });
            }
        },
        controller: function($scope, appData, $translate, dataProvider){
            console.log('appData in Ctrl ', appData);
            $scope.appData = appData;
            $scope.currentLanguage = guessLanguage($translate.use());
            $scope.deleteData = dataProvider.deleteData;
            $scope.refreshData = function() {
                dataProvider.refreshData().then(function(data){
                    console.log('refresh: new data saved', data);
                    angular.forEach(data, function(resource, resourceName) {
                        $scope.appData[resourceName] = resource;
                    });
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
        }
    });
});

