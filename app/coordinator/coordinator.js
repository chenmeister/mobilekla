/**
 * Created by seanchen on 9/13/15.
 */

angular.module('myApp.coordinator', ['ngRoute', 'firebase'])
.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/coordinator',{
        templateUrl:'coordinator/coordinator.html',
        controller:'CoordinatorCtrl'
    });
}])
.controller('CoordinatorCtrl',['$scope','$firebaseAuth', '$location', function($scope, $firebaseAuth, $location){

    var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");
    var loginObj = $firebaseAuth(firebaseObj);

    //when user clicks submit, get form information and display whether
    $scope.signIn = function(){

        var username = $scope.user.email;
        var password = $scope.user.password;

        //login is successful or not
        loginObj.$authWithPassword({
            email: username,
            password: password
        }).then(function(user){

            // create 4 digit code (numbers 1000 to 9999)
            var max = 9999, min = 1000;
            var fourDigitCode = Math.floor(Math.random() *(max - min + 1)) + min;
            firebaseObj.child('Code').set(fourDigitCode);

            //go to entercode page and show the randomly created 4 digit code
            $location.path('/entercode');

        },function(error){
            alert("Invalid Username/Password");
        });
    }

}]);