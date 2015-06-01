/**
 * <p/>
 * Created by Benjamin Jacob on 24.02.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.states', []);
angular.module('fsMobile.states').config(function ($stateProvider) {
    console.log('state init');
    $stateProvider.state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'states/home/home.html',
                controller: function ($scope,$timeout, $state) {

                    $scope.news = [
                        {   title: 'Toiletten verstopft!',
                            text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ' +
                            'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna ' +
                            'aliquyam erat, sed diam voluptua. At vero eos et accusam et justo ' +
                            'duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata ' +
                            'sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,' +
                            ' consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ' +
                            'ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos ' +
                            'et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, ' +
                            'no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                            date: '2015.08.01 - 20:00'
                        },
                        {   title: 'Freibier für alle!',
                            text: 'Stet clita kasd gubergren, no sea takimata ' +
                            'sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,' +
                            ' consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ' +
                            'ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos ' +
                            'et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, ' +
                            'no sea takimata sanctus est Lorem ipsum dolor sit amet.',
                            date: '2015.08.02 - 12:00'
                        }
                    ];

                }
            }
        }
    });
});
