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
.controller('DashboardCtrl', ['$scope','$firebaseObject', '$firebaseUtils', '$location', function($scope, $firebaseObject, $firebaseUtils, $location){

    var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");

    //get activity name
    var activityName = $firebaseObject(firebaseObj.child('Activity'));
    $scope.activityName = activityName;

    //display activity information
    $scope.activityName.$loaded().then(function(){
        var dbactivity = $scope.activityName.dbname;
        $scope.studentInfo = $firebaseObject(firebaseObj.child(dbactivity+'/students'));
        if(dbactivity === "Binary"){
            $scope.decimalNum = $firebaseObject(firebaseObj.child(dbactivity));
        } else if(dbactivity === "Switch"){

        }

    });

}]);