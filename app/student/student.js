/**
 * Created by seanchen on 9/13/15.
 */
'use strict';

angular.module('myApp.student', ['ngRoute', 'firebase']).
config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/student',{
            templateUrl:'student/student.html',
            controller: 'StudentCtrl'
        })
    }]
).
controller('StudentCtrl',['$scope',function($scope){

        var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");
        var actualCode = "";

        //get 4 digit code from the database
        firebaseObj.child("Code").on("value", function(snapshot){
            console.log(snapshot.val());
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
                firebaseObj.child("Students").push().set({name: studentName});

                // send them to loading page to wait for activity chosen by coordinator


                // once activity is selected and all students log in, guide them to page based on user id, and value assigned to them


            } else {
                console.log("Not Successful!");
                // show error and have student re-enter the correct credentials

            }

        }

    }]
);