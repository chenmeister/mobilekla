'use strict';

angular.module('myApp.studentlogin', ['ngRoute', 'firebase'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/studentlogin',{
        templateUrl:'studentlogin/studentlogin.html',
        controller: 'StudentLoginCtrl'
    });
}])
.controller('StudentLoginCtrl',['$scope','$location','$firebaseObject','$firebaseArray',function($scope, $location, $firebaseObject,$firebaseArray){

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

            // send them to studentview page and show please wait on all pages
            $firebaseArray(firebaseObj.child("Students")).$add({
                name: studentName
            }).then(function(student){
                console.log("Student Key: " + student.key());
                $location.path('/studentview/'+student.key()+'/'+studentName);
            });

        } else {
            console.log("Not Successful!");

            // show error and have student login re-enter the correct credentials
            alert('Incorrect credentials, Please re-enter them');
        }
    }

}]);