var ngpres = angular
    .module('ngpres', []);

ngpres.controller('SlideCtrl', function ($rootScope, $location) {

    this.update = function () {
        this.slideId = parseInt($location.path().slice(1)) || 0;
    };

    // Update on url change
    $rootScope.$on('$locationChangeSuccess', this.update.bind(this));


    this.next = function() {
        $location.path(
            '/' + (this.slideId + 1)
        );
    };

    this.prev = function() {
        $location.path(
            '/' + (this.slideId - 1)
        );
    };

    this.update();

});

ngpres.directive('npSpoiler', function () {
    return {
        restrict: 'E',
        scope: true,
        transclude: true,
        template:
            '<a href="" ng-click="visible = !visible">' +
                '{{visible ? "skjul" : "vis mer"}}' +
            '</a><div ng-if="visible" ng-transclude></div>',
        link: function (scope, element) {
            scope.visible = false;
        }
    };
});

ngpres.directive('npNavigationHandler', function () {
    return {
        restrict: 'A',

        link: function (scope, element, attributes) {

            function next() {
                scope.$apply(attributes.npNextSlide);
            }

            function previous() {
                scope.$apply(attributes.npPrevSlide);
            }

            var events = [
                [
                    'wheel',
                    function (event) {
                        if (event.deltaY > 0) {
                            next();
                        } else {
                            previous();
                        }

                        event.preventDefault();
                    }
                ]
            ];

            events.forEach(function (pair) {
                element[0].addEventListener(pair[0], pair[1], true);
            });

            scope.$on('$destroy', function () {
                events.forEach(function (pair) {
                    element[0].removeEventListener(pair[0], pair[1], true);
                });
            });
        }

    };
});
