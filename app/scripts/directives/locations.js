/**
 * location map
 * <p/>
 * Created by Benjamin Jacob on 30.06.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.directives').directive('locmap', function () {


    var defaultSize = 60;



    function createLocationMarker(x, y, width, height) {
        var elem = document.createElement('div');
        elem.style.top = x + 'px';
        elem.style.left = y + 'px';
        elem.style.width = width + 'px';
        elem.style.height = height + 'px';
        elem.style.backgroundColor = 'black';
        elem.style.borderRadius = width + 'px';
        elem.className = 'location-pin';
        return elem;
    }

    return {
        restrict: 'E',
        template: '<div style="width: 2000px; height: 996px; background: url(\'{{imageUrl}}\')"></div>',
        replace: true,
        require:'ngModel',
        scope: {
            imageUrl: '@',
            locations: '='

        },
        link: function (scope, elem, attrs, ctrl) {

            console.log('locmap scope', scope);
            angular.forEach(scope.locations, function (loc) {
                console.log('loc', loc);
                var coord = loc.geoCoordinate;
                var size = coord.size||defaultSize;
                var clbl = createLocationMarker(coord.longitude, coord.latitude, size, size);
                angular.element(clbl).bind('click', function (e) {
                    e.stopPropagation();
                    scope.locationClicked(loc);
                });
                elem.append(clbl);

            });

            scope.locationClicked = function (location) {
                console.log('location', location.translations.de.name);
                scope.$apply(function(){
                    console.log('apply');
                    ctrl.$setViewValue(location);
                });

            };
        }
    };
});
