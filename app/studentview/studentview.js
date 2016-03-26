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
).controller('StudentViewCtrl',['$scope','$routeParams', '$firebaseObject', '$firebaseUtils',
    function($scope, $routeParams, $firebaseObject, $firebaseUtils){

    //get database value based on student information
    var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com");

    //get student information from the paramaters to run the activity
    var stuid = $routeParams.studentid;
    var stuname = $routeParams.studentname;

    //get details
    $scope.username = stuname;

    //get activity name and set up parameters based on activity
    //display the information on the webpage
    var dbactivity = '';
    var decActivity ='';
    var swActivity = '';
    var sortActivity = '';
    var studentInfo = '';

    $scope.activityName = $firebaseObject(firebaseObj.child('Activity'));
    $scope.activityName.$loaded().then(function(){
        dbactivity = $scope.activityName.dbname;
        $scope.studentInfo = $firebaseObject(firebaseObj.child(dbactivity+'/students/'+stuname));
        studentInfo = $scope.studentInfo;
        if(dbactivity === "Binary"){
            $scope.decActivity = $firebaseObject(firebaseObj.child(dbactivity));
            decActivity = $scope.decActivity;
        }
        else if(dbactivity === "Switch"){
            $scope.allCases = $firebaseObject(firebaseObj.child(dbactivity+'/students'));
            $scope.swActivity = $firebaseObject(firebaseObj.child(dbactivity));
            swActivity = $scope.swActivity;
        }
        else if(dbactivity === "Quicksort"){
            $scope.sortActivity = $firebaseObject(firebaseObj.child(dbactivity));
            sortActivity = $scope.sortActivity;
        }
    });


        $scope.response = function(result){

        // for binary
        $scope.activityName.$loaded().then(function(){

            if(dbactivity === "Binary"){

                // get current added result from database
                var runValue = decActivity.currentAddedValue;
                var stuBit = studentInfo.bit;
                var calculateBin = 0;

                //if student result is 0 and if student changes to one
                if(studentInfo.studentBit == 0 && result == 1){
                    // add current added result from bit value
                    calculateBin = runValue+stuBit;
                    // subtract current added result from bit value
                    firebaseObj.child(dbactivity+"/currentAddedValue").set(calculateBin);

                } // if student result is previously 1 and changes to 0
                else if(studentInfo.studentBit == 1 && result == 0){
                    // subtract current added result from bit value
                    calculateBin = runValue-stuBit;
                    // subtract current added result from bit value
                    firebaseObj.child(dbactivity+"/currentAddedValue").set(calculateBin);

                }

                // set student result to database
                firebaseObj.child("Binary/students/"+stuname+"/studentBit").set(result);

            } else if(dbactivity === "Switch"){

                // for var student select correct response
                if(studentInfo.role == "var"){
                    console.log(result);
                    // if response is correct, show on user view
                    if(result === swActivity.varItem){
                       console.log("Good Stuff");
                    }

                } else {
                    console.log(result);
                    // if response is correct highlight the result on dashboard
                    if(result === "yes"){
                        if(swActivity.varItem === studentInfo.item){
                            console.log("Correct Choice");
                            //set student answered to true
                            firebaseObj.child("Switch/students/"+stuname+"/answered").set(true);
                        } else {
                            console.log("InCorrect Choice");
                            // set student answered to false
                        }

                    } else {    // else respond with incorrect answer
                        if(swActivity.varItem !== studentInfo.item){
                            console.log("Correct Choice");
                            // set answered to true
                            firebaseObj.child("Switch/students/"+stuname+"/answered").set(true);

                        } else {
                            console.log("InCorrect Choice");
                        }
                    }

                }


            } else if(dbactivity === "Quicksort"){

                var studentNum = studentInfo.number;
                var pivotValue = sortActivity.currentPivotValue;
                var onLeftPointer = sortActivity.onLeftPointer;
                var onRightPointer = sortActivity.onRightPointer;
                var stepValue = sortActivity.currentStep;
                var totalSteps = sortActivity.totalSteps;


                // if response is yes for either pivot
                if(result === "yes"){
                    // check if left pointer value is greater than pivot, if so move to right pivot
                    if((studentNum >= pivotValue) && onLeftPointer){
                        console.log("Switching to right pivot");
                        // get left pointer swap student name and set it to a variable
                        firebaseObj.child("Quicksort/leftPointerSwapName").set(stuname);
                        firebaseObj.child("Quicksort/leftPointerSwapPos").set(studentInfo.position);

                        // move pointer up by one
                        firebaseObj.child("Quicksort/currentLeftPointer").set(studentInfo.position+1);

                        //set left pivot to false and right pivot to true
                        firebaseObj.child("Quicksort/onLeftPointer").set(false);
                        firebaseObj.child("Quicksort/onRightPointer").set(true);

                    }
                    // if right pivot value is less than pivot, swap values
                    else if((studentNum <= pivotValue) && onRightPointer){

                        firebaseObj.child("Quicksort/currentRightPointer").set(studentInfo.position-1);

                        console.log("Swapping positions, then switching to left pivot");

                        // set right pointer student to left pointer
                        firebaseObj.child("Quicksort/students/"+stuname+"/position").set(sortActivity.leftPointerSwapPos);

                        // set left pointer student to current right pointer
                        firebaseObj.child("Quicksort/students/"+sortActivity.leftPointerSwapName+"/position").set(studentInfo.position);

                        // set right pivot to false and left pivot to true
                        firebaseObj.child("Quicksort/onLeftPointer").set(true);
                        firebaseObj.child("Quicksort/onRightPointer").set(false);

                    }
                    // otherwise return error and have student switch response to correct one
                    else {
                        console.log("incorrect response please change to correct answer");
                    }
                    // continue same process until pointers cross
                } else { // if response is no

                    // check if response is correct, if so follow the steps
                    if(onLeftPointer && (studentNum < pivotValue)){
                        console.log("Moving pointer up by one");
                        firebaseObj.child("Quicksort/currentLeftPointer").set(studentInfo.position+1);
                    }
                    // for right pivot decrement right pointer
                    else if(onRightPointer && (studentNum > pivotValue)){
                        console.log("Moving pointer down by one");
                        firebaseObj.child("Quicksort/currentRightPointer").set(studentInfo.position-1);
                    }
                    // if incorrect show incorrect and have user switch answer to make it correct
                    else{
                        console.log("incorrect response please change to correct answer");
                    }

                }

                // once the pointers cross
                if(sortActivity.currentLeftPointer > sortActivity.currentRightPointer){
                    // increment current order and show the next line

                    var newStepValue = stepValue+1;

                    // keep repeating until sort orders are completed
                    if((totalSteps-1) === newStepValue){
                        firebaseObj.child("Quicksort/sorted").set(true);
                    }

                    firebaseObj.child("Quicksort/currentStep").set(newStepValue);

                    // get the next step data and then set the parameters based on the values accordingly
                    //set the step show to true

                    var stepName = "step"+newStepValue;
                    firebaseObj.child("Quicksort/currentPivotPointer").set(sortActivity.sortsteps[stepName].pivotPointer);
                    firebaseObj.child("Quicksort/currentPivotValue").set(sortActivity.sortsteps[stepName].pivotValue);
                    firebaseObj.child("Quicksort/currentLeftPointer").set(sortActivity.sortsteps[stepName].leftPointer);
                    firebaseObj.child("Quicksort/currentRightPointer").set(sortActivity.sortsteps[stepName].rightPointer);
                    firebaseObj.child("Quicksort/sortsteps/"+stepName+"/showLine").set(true);
                    firebaseObj.child("Quicksort/onLeftPointer").set(true);
                    firebaseObj.child("Quicksort/onRightPointer").set(false);

                }


            }

        });

    }

    }]
);