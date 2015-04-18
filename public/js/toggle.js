'use strict';

angular.module('cssPracticeApp', []).directive('toggleDiv', function () {
    return {
        replace: true,
        transclude: true,
        template: '<div ng-click="toggle()" ng-transclude></div>',
        restrict: 'A',
        scope: {
        },
        link: function postLink(scope, element, attrs) {

            // the class to toggle
            var t_c = attrs.toggleClass;

            // initialize the class
              element.toggleClass(t_c, (attrs.toggleActive == 'true' ? true : false));

            // toggle the class
            scope.toggle = function()
            {
                element.toggleClass(t_c);
            };

        }
    };
});
