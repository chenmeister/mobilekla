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
.controller('DashboardCtrl', ['$scope','$firebaseObject', '$firebase', '$location', function($scope, $firebaseObject, $firebase, $location){
        var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");

        firebaseObj.child("Activity").on("value", function(snapshot){
            var activity = snapshot.val();
            $scope.activityName = activity.title;

            if(activity.name === "quicksort"){
                // get Quicksort object of students from firebase
                var values = $firebaseObject(firebaseObj.child("Quicksort/students"));
                // run quicksort activity
                quicksort(values);

            } else if(activity.name === "switch"){
                console.log("It's switch time");

            } else if(activity.name === "binary"){
                console.log("It's binary time");

            }

        }, function(errorObject){
            console.log("The read failed: " + errorObject.code);
        });

        //get activity name and then pull the information from the object and display on the webpage

        function swap(items, firstIndex, secondIndex) {
            var temp = items[firstIndex];   //get position value at firstIndex obj
            items[firstIndex] = items[secondIndex]; //set position value of secondIndex obj to firstIndex obj
            items[secondIndex] = temp;  //set position value of secondIndex obj to firstIndex obj
        }

        function partition(items, left, right) {

            var pivot = items[Math.floor((left+right)/2)].number,  //reset pivot object
                i = left,
                j = right;
            console.log("Pivot Value: "+pivot);

            console.log("Left Pointer Value: "+i);
            console.log("Right Pointer Value: "+j);

            // for quicksort loop through the studentlogin objects from the Quicksort Table
            while (i <= j){
                // start with the left pointer value and update each time
                // once left pointer reaches value greater than pivot stop
                while (items[i].number < pivot) {
                    i++;
                    console.log("Left Pointer at: "+i);
                }
                // start the right pointer and move until the value is less than pivot
                // swap the values and update the tables object accordingly
                while (items[j] > pivot) {
                    j--;
                    console.log("Right Pointer at: "+j);
                }
                if(i <= j) {
                    console.log("Swap Values");
                    swap(items, i, j);
                    i++;
                    j--;
                    console.log("Left Pointer at: "+i);
                    console.log("Right Pointer at: "+j);
                }
                // keep moving until the left and right pointers cross each other
            }
            console.log("\n");
            return i;

        }

        function quicksort(items, left, right) {

            var index;

            console.log(Object.keys(items).length);
            if (items.length > 1) {

                left = typeof left != "number" ? 0 : left;
                right = typeof right != "number" ? items.length - 1 : right;

                //index = partition(items, left, right);
                console.log(items);

                console.log("Current Index: "+index);

                // repeat recursive process until each value is sorted properly
                // update studentlogin activity each time
                if (left < index - 1) {
                    console.log("Sorting the left values");
                    //quicksort(items, left, index - 1);
                }

                if (index < right) {
                    console.log("Sorting the right values");
                    //quicksort(items, index, right);
                }

            }

        }

        // for switch statements display each case and then the default case
        // have the var studentlogin select the correct case
        // then for each case studentlogin select if the var case applies to them or not

        // for decimal to binary conversion have each studentlogin as bit and show all 0's
        // on each switch show if the value is correct
        //

    }]
)