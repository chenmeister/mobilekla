/**
 * Created by seanchen on 11/14/15.
 */
angular.module('myApp.studentview',['ngRoute', 'firebase']).
    config(['$routeProvider', function ($routeProvider) {
        //put student id
        $routeProvider.when('/studentview/:studentid/:studentname',{
            templateUrl:'studentview/studentview.html',
            controller:'StudentViewCtrl'
        });
    }]
).controller('StudentViewCtrl',['$scope','$routeParams', '$firebaseObject', '$firebaseUtils', function($scope, $routeParams, $firebaseObject, $firebaseUtils){

    //get database value based on student information
    var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");

    //get student information from the paramaters to run the activity
    var stuid = $routeParams.studentid;
    var stuname = $routeParams.studentname;

    //get details
    $scope.username = stuname;

    //get activity name and set up parameters based on activity
    $scope.activityName = $firebaseObject(firebaseObj.child('Activity'));
    $scope.activityName.$loaded().then(function(){
        var dbactivity = $scope.activityName.dbname;
        $scope.studentInfo = $firebaseObject(firebaseObj.child(dbactivity+'/students/'+stuname));
        if(dbactivity === "Binary"){
            $scope.decimalNum = $firebaseObject(firebaseObj.child(dbactivity));
        }
    });

    //display the information on the webpage

    // for quicksort have a button with yes or no for greater than pivot
    // if yes stop left pointer and then start with right pointer
    // once right pivot is less than pivot hit yes and swap the positions
    // show the next line for the sorted value and run pointers until they cross
    // run the activity until the students match the last value in the array

    // for switch statements on the case statements select yes or no if correct value
    // if the answer is correct or not by asking the case student
    // for var student go to each student and ask each student for each value


    // for binary start with bit 128 and work downwards to add up the correct numbers
    // to the correct value, show flip on each correct result

    }]
);