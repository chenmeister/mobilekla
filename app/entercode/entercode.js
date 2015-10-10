/**
 * Created by seanchen on 10/5/15.
 */

angular.module('myApp.entercode', [
    'ngRoute', 'firebase'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/entercode', {
        templateUrl: 'entercode/entercode.html',
        controller: 'EnterCodeCtrl'

    })
}]
)
.controller('EnterCodeCtrl', ['$scope', '$firebaseAuth', function($scope, $firebaseAuth){
        var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com/Code");

        //get the four digit code and display it to the webpage
        firebaseObj.on("value", function(snapshot){
            console.log(snapshot.val());
            $scope.codekey = snapshot.val();

        }, function(errorObject){
           console.log("The read failed: " + errorObject.code);
        });
    }]
);