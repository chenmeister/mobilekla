'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.home',
    'myApp.studentlogin',
    'myApp.coordinator',
    'myApp.entercode',
    'myApp.dashboard',
    'myApp.studentview'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/home'});
}]);
