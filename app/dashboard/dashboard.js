/**
 * Created by seanchen on 10/17/15.
 */

angular.module('myApp.dashboard',['ngRoute', 'firebase'])
.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/dashboard',{
            templateUrl:'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        })
    }]
)
.controller('DashboardCtrl', ['$scope','$firebaseObject', '$firebaseUtils', '$location', '$firebaseArray',
    function($scope, $firebaseObject, $firebaseUtils, $location, $firebaseArray){

    var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");

    //get activity name
    var activityName = $firebaseObject(firebaseObj.child('Activity'));
    $scope.activityName = activityName;

    var sortActivity = '';

    //display activity information
    $scope.activityName.$loaded().then(function(){
        var dbactivity = $scope.activityName.dbname;
        if(dbactivity === "Binary"){
            var studentBits = $firebaseArray(firebaseObj.child(dbactivity+'/students').orderByChild("position"));
            $scope.studentInfo = studentBits;
            $scope.decimalNum = $firebaseObject(firebaseObj.child(dbactivity));
        } else if(dbactivity === "Switch"){
            $scope.studentInfo = $firebaseArray(firebaseObj.child(dbactivity+'/students'));
            $scope.swActivity = $firebaseObject(firebaseObj.child(dbactivity));
        } else if(dbactivity === "Quicksort"){
            $scope.sortActivity = $firebaseObject(firebaseObj.child(dbactivity));
            sortActivity = $scope.sortActivity;
            $scope.sortOrder = $firebaseArray(firebaseObj.child(dbactivity+'/sortsteps'));
            $scope.studentInfo = $firebaseArray(firebaseObj.child(dbactivity+'/students').orderByChild("position"));

        }
    });

    $scope.endActivity = function(){
        var result = confirm('Are you sure you want to quit?');
        //return to dashboard if activity ends
        if(result){
            $location.path('/entercode');
        }
    }

}]);