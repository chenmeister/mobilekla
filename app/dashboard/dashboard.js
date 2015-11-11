/**
 * Created by seanchen on 10/17/15.
 */
angular.module('myApp.dashboard',[
    'ngRoute', 'firebase'
])
.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/dashboard',{
            templateUrl:'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        })
    }]
)
.controller('DashboardCtrl', ['$scope','$firebaseAuth', '$location', function($scope, $firebaseAuth, $location){
        var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");
        firebaseObj.child("Activity").on("value", function(snapshot){
            $scope.activityName = snapshot.val();
        }, function(errorObject){
            console.log("The read failed: " + errorObject.code);
        });

        //get activity name and then pull the information from the object and display on the webpage

        // for quicksort loop through the student objects from the Quicksort Table

        // start with the left pointer value and update each time
        // once left pointer reaches value greater than pivot stop
        // start the right pointer and move until the value is less than pivot
        // swap the values and update the tables object accordingly
        // keep moving until the left and right pointers cross each other
        // repeat process until each value is sorted properly
        // update student activity each time

        // for switch statements display each case and then the default case
        // have the var student select the correct case
        // then for each case student select if the var case applies to them or not

        // for decimal to binary conversion have each student as bit and show all 0's
        // on each switch show if the value is correct

    }]
)