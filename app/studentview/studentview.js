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
    //display the information on the webpage

    $scope.activityName = $firebaseObject(firebaseObj.child('Activity'));
    $scope.activityName.$loaded().then(function(){
        var dbactivity = $scope.activityName.dbname;
        $scope.studentInfo = $firebaseObject(firebaseObj.child(dbactivity+'/students/'+stuname));
        if(dbactivity === "Binary"){
            $scope.decimalNum = $firebaseObject(firebaseObj.child(dbactivity));
        }
        else if(dbactivity === "Switch"){
            $scope.allCases = $firebaseObject(firebaseObj.child(dbactivity+'/students'));
        }

    });


    $scope.result = function(result){

        console.log(result);

        // if the activity is quicksort

            // get response from student and store to variable
            // if response is yes
                // check if left pivot value is greater than pivot, if so move to right pivot
                // if right pivot value is less than pivot, swap values and continue the process
                // otherwise return error and have student switch response to correct one
            // if response is no
                // for left pivot increment the left pointer value
                // for right pivot decrement the right pointer value

        // for switch statements on the case statements select yes or no if correct value
        // if the answer is correct or not by asking the case student
        // for var student select correct response

        // for binary start with bit 128 and work downwards to add up the correct numbers
        // to the correct value, show flip on each correct result


    }


    }]
);