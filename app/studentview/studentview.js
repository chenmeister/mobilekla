/**
 * Created by seanchen on 11/14/15.
 */
angular.module('myApp.studentview',['ngRoute', 'firebase']).
    config(['$routeProvider', function ($routeProvider) {
        //put student id
        $routeProvider.when('/studentview',{
            templateUrl:'studentview/studentview.html',
            controller:'StudentViewCtrl'
        })
    }]
).controller('StudentViewCtrl',['$scope', function($scope){

        //get database value based on student information
        var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");

        //get the activity and student information to run the activity

        //display the information on the webpage

        //give student the opportunity to interact with the app

        // for quicksort have a button with yes or no for greater than pivot
        // if yes change result in database and when right pivot clicks
        // yes swap the positions
        // run pointers both until they cross

        // for switch statements on the case statements select
        // if the answer is correct or not by asking the case student
        // for var student go to each student and ask each student for each value

        // for binary start with bit 128 and work downwards to add up the correct numbers
        // to the correct value

    }]
);