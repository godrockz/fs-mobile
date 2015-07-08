/**
 * location map
 * <p/>
 * Created by Benjamin Jacob on 30.06.15.
 * <p/>
 */
'use strict';
angular.module('fsMobile.directives').directive('locmap', function (debug) {


    var defaultSize = 60;



    function createLocationMarker(x, y, width, height) {
        var elem = document.createElement('div');
        elem.style.top = x + 'px';
        elem.style.left = y + 'px';
        elem.style.width = width + 'px';
        elem.style.height = height + 'px';
        elem.style.borderRadius = width + 'px';
        elem.className = 'location-pin';
        return elem;
    }

    return {
        restrict: 'E',
        template: '<div style="width: 1847px; height: 911px; background: url(\'{{imageUrl}}\')"></div>',
        replace: true,
        require:'ngModel',
        scope: {
            imageUrl: '@',
            locations: '='

        },
        link: function (scope, elem, attrs, ctrl) {
            angular.forEach(scope.locations, function (loc) {
                var coord = loc.geoCoordinate;
                var size = coord.size||defaultSize;
                var clbl = createLocationMarker(coord.longitude, coord.latitude, size, size);
                angular.element(clbl).bind('click', function (e) {
                    e.stopPropagation();
                    scope.locationClicked(loc);
                });
                elem.append(clbl);
            });

            if(debug.isDebugEnabled()){
                elem.addClass('debug');
            };

            scope.locationClicked = function (location) {
                scope.$apply(function(){
                    ctrl.$setViewValue(location);
                });

            };
        }
    };
});
