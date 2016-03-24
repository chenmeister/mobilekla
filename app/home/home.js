/**
 * Created by seanchen on 9/13/15.
 */
'use strict';

angular.module('myApp.home', ['ngRoute'])
.config(['$routeProvider',function($routeProvider){
     $routeProvider.when('/home',{
         templateUrl: 'home/home.html'
     });
}]);