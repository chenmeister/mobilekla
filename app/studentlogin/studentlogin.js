/**
 * Created by seanchen on 9/13/15.
 */
'use strict';

angular.module('myApp.studentlogin', ['ngRoute', 'firebase']).
    config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/studentlogin',{
            templateUrl:'studentlogin/studentlogin.html',
            controller: 'StudentLoginCtrl'
        })
    }]
).controller('StudentLoginCtrl',['$scope','$location','$firebaseArray', '$firebaseObject',function($scope, $location, $firebaseArray, $firebaseObject){

        var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");
        var actualCode = "";

        //get 4 digit code from the database
        firebaseObj.child("Code").on("value", function(snapshot){
            actualCode = snapshot.val();
        }, function(errorObject){
            console.log("The read failed: " + errorObject.code);
        });

        $scope.signIn = function() {

            //get the students full name or nickname then 4 digit code
            var studentName = $scope.student.name;
            var code = $scope.student.code;

            //allow access to standby page
            if(code == actualCode){
                console.log("Login Successful!");
                //firebaseObj.child("Students").push().set({name: studentName});

                // save name to a common user table and then

                // send them to studentview page and show please wait on all pages
                $location.path('/studentview');

            } else {
                console.log("Not Successful!");
                // show error and have student login re-enter the correct credentials
                alert('Incorrect credentials, Please re-enter them');

            }

        }

    }]
);