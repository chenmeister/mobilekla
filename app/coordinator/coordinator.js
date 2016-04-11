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
    
.controller('CoordinatorCtrl',['$scope','$firebaseAuth', 'CommonProp', '$location',
    function($scope, $firebaseAuth, CommonProp, $location){

    var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");
    var loginObj = $firebaseAuth(firebaseObj);

    var login = {};
    $scope.login = login;

    loginObj.$onAuth(function(authData){
        if(authData){
            console.log("Auto Login");
            CommonProp.setUser(authData.password.email);
            $location.path('/entercode');
        }
    });

    //when user clicks submit, get form information
    $scope.signIn = function(){

        var username = $scope.user.email;
        var password = $scope.user.password;

        //login is successful or not
        loginObj.$authWithPassword({
            email: username,
            password: password
        }).then(function(user){
            CommonProp.setUser(user.password.email);

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

}])
.service('CommonProp',['$location','$firebaseAuth', function($location, $firebaseAuth){
    var user = '';

    var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");
    var loginObj = $firebaseAuth(firebaseObj);

    return {
        getUser: function() {
            if(user == ''){
                user = localStorage.getItem('userEmail');
            }
            return user;
        },
        setUser: function(value) {
            localStorage.setItem("userEmail", value);
            user = value;
        },
        logoutUser: function(){
            loginObj.$unauth();
            user='';
            localStorage.removeItem('userEmail');
            // get rid off all information in objects
            $location.path('/coordinator');
        }
    };

}]);