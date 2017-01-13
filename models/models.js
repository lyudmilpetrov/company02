let oM = angular.module('O2', ['ngRoute', 'ngDialog', 'ngAnimate', 'ngSanitize', 'ui.select', 'ui.grid', 'ui.grid.selection', 'ui.grid.autoResize', 'ui.grid.resizeColumns', 'ngMap', 'chart.js']);
oM.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider.when('/login', {
        templateUrl: 'views/login.html',
        controller: 'oMCtrl',
        controllerAs: 'C0'
    });
    $routeProvider.when('/start', {
        templateUrl: 'company02/views/start.html',
        controller: 'oStartCtrl',
        controllerAs: 'C1'
    });
    $routeProvider.when('/maps', {
        templateUrl: 'views/maps.html',
        controller: 'oMapsCtrl',
        controllerAs: 'C2'
    });
    $routeProvider.when('/charts', {
        templateUrl: 'views/charts.html',
        controller: 'oChartsCtrl',
        controllerAs: 'C3'
    });
    $routeProvider.when('/details', {
        templateUrl: 'views/details.html',
        controller: 'oDetailsCtrl',
        controllerAs: 'C4'
    });
    $routeProvider.otherwise({
        templateUrl: 'views/login.html',
        controller: 'oMCtrl as C0',
       controllerAs: 'C0'
    });
}]);
oM.run(['$window', '$rootScope', function ($window, $rootScope) {
    $rootScope.online = navigator.onLine;
    $window.addEventListener('offline', function () {
        $rootScope.$apply(function () {
            $rootScope.online = false;
        });
    }, false);
    $window.addEventListener('online', function () {
        $rootScope.$apply(function () {
            $rootScope.online = true;
        });
    }, false);
}])



