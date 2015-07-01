/**
 * location map
 * <p/>
 * Created by Benjamin Jacob on 30.06.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.directives').directive('locmap', function () {
    function createLocationMarker(x, y, width, height) {
        var elem = document.createElement('div');
        elem.style.position = 'absolute';
        elem.style.top = x + 'px';
        elem.style.left = y + 'px';
        elem.style.border = '1px solid red';
        elem.style.width = width + 'px';
        elem.style.height = height + 'px';
        elem.style.backgroundColor = 'black';
        elem.style.opacity = 0.5;
        elem.class='lcoation-marker';
        return elem;
    }

    return {
        restrict: 'E',
        template: '<div style="width: 2000px; height: 996px; background: url(\'{{imageUrl}}\')"></div>',
        replace: true,
        scope: {
            imageUrl: '@',
            locations: '='
        },
        link: function (scope, elem) {
            var size=60;
            console.log('locmap scope', scope);
            angular.forEach(scope.locations, function (loc) {
                console.log('loc', loc);
                var coord = loc.geoCoordinate;
                var clbl = createLocationMarker(coord.longitude, coord.latitude, size, size);
                console.log('got clbl', clbl);
                angular.element(clbl).bind('click',function(){ scope.locationClicked(loc);});
                elem.append(clbl);

            });

            scope.locationClicked=function(location){
                console.log('location',location.translations.de.name);
            }
        }
    };
});
