/**
 * Created by seanchen on 9/13/15.
 */
'use strict';

angular.module('myApp.student', ['ngRoute']).
config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/student',{
            templateUrl:'student/student.html',
            controller: 'StudentCtrl'
        })
    }]
).
controller('StudentCtrl',['$scope',function($scope){

        var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com/Code");
        var actualCode = "";

        //get 4 digit code from the database
        firebaseObj.on("value", function(snapshot){
            console.log(snapshot.val());
            actualCode = snapshot.val();
        }, function(errorObject){
            console.log("The read failed: " + errorObject.code);
        });

        $scope.signIn = function() {

            //get the students full name or nickname then 4 digit code
            var name = $scope.student.name;
            var code = $scope.student.code;

            //allow access to standby page
            if(code == actualCode){
                console.log("Login Successful!");

            } else {
                console.log("Not Successful!");
            }

        }

    }]
);