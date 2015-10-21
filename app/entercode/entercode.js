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
.controller('EnterCodeCtrl', ['$scope', '$firebaseAuth', '$firebase', function($scope, $firebaseAuth, $firebase){
        var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com/");

        //get the four digit code and display it to the webpage
        firebaseObj.child("Code").on("value", function(snapshot){
            console.log(snapshot.val());
            $scope.codekey = snapshot.val();
        }, function(errorObject){
           console.log("The read failed: " + errorObject.code);
        });

        var sync = $firebase(firebaseObj.child("Students").orderByChild('name'));
        var arrayValues = sync.$asArray();
        $scope.studentlist = arrayValues;

        //create the start activity function (develop quicksort as the example app)
        $scope.startActivity = function(name){

            //get the activity name and organize student based on order entered
            console.log(name);

            //for quicksort, randomly generate each number for each student
            if(name === "quicksort"){
                //randomly generate each number and start position index from 0


            } else if(name === "switch"){
            //for switch statement, assign first student as item, the other 6 as cases, and last one as default case


            } else if(name === "binary"){
            //for decimal to binary, generate a random number and have each student as a bit (ex. 128, 64, 32, 16, 8, 4, 2, 1)


            }

            //go to the dashboard page

        }

    }]
);