oM.directive("menu", function () {
    return {
        restrict: "E",
        template: "<div ng-class='{ show: visible, left: alignment === \"left\", right: alignment === \"right\" }' ng-transclude></div>",
        transclude: true,
        scope: {
            visible: "=",
            alignment: "@"
        }
    };
});
oM.directive("menuItem", function () {
    return {
        restrict: "E",
        template: "<div ng-click='navigate()' ng-transclude></div>",
        transclude: true,
        scope: {
            hash: "@"
        },
        link: function ($scope) {
            $scope.navigate = function () {
                window.location.hash = $scope.hash;
            }
        }
    }
});
oM.directive('clickOutside', function () {
    return function (scope, elem) {
        var x = document.getElementsByTagName("BODY")[0];
        x.addEventListener('click', function () {
            dropdown = false;
            scope.$apply();
        });
        elem.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }
});