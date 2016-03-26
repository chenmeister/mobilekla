/**
 * Created by seanchen on 10/5/15.
 */
angular.module('myApp.entercode', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/entercode', {
        templateUrl: 'entercode/entercode.html',
        controller: 'EnterCodeCtrl'
    })
}])

.controller('EnterCodeCtrl', ['$scope', '$firebaseArray', '$location', function($scope, $firebaseArray, $location){

    // set datbase parameter
    var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com/");

    //get the four digit code
    firebaseObj.child("Code").on("value", function(snapshot){
        $scope.codekey = snapshot.val();
    }, function(errorObject){
       console.log("The read failed: " + errorObject.code);
    });

    //get the list of students
    var sync = $firebaseArray(firebaseObj.child("Students").orderByChild('name'));
    $scope.studentlist = sync;

    var studentNames;

    // when Start Activity button is clicked run the startActivity function
    $scope.startActivity = function(name){

        studentNames = new Array(); // allocate for a list of students
        firebaseObj.child("Students").once("value", function(snapshot){
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                studentNames.push(childData.name);
            });
        });

        if(name === "binary"){
            firebaseObj.child('Activity').set({title:"Decimal To Binary", name:"binary", dbname:"Binary"});
            startDecimalToBinary();
        } else if(name === "quicksort"){
            firebaseObj.child('Activity').set({title:"Quicksort", name:"quicksort", dbname:"Quicksort"});
            startQuicksort();
        } else if(name === "switch"){
            firebaseObj.child('Activity').set({title:"Switch Statements", name:"switch", dbname:"Switch"});
            startSwitch()
        }

        //go to the dashboard page once all students are set up
        $location.path('/dashboard');
    }

    // when logout button is clicked, guide all students to the online survey on surveymonkey
    // clear all student data once that happens

    // switch statements
    function startSwitch(){
        //pick random studentlogin to be item and default, assign other students as case statements
        var itemStudent = 6;
        var defaultStudent = 7;
        var randomItem = 4;

        var items = ["apple","orange","banana","grape","pear","peach","random fruit"];

        for(var stu=0; stu < 6; stu++){
            var student = studentNames[stu];
            firebaseObj.child("Switch/students/"+student).set({role:"case", item:items[stu], answered: false});
        }
        firebaseObj.child("Switch/students/"+studentNames[itemStudent]).set({role:"var", item: items[randomItem], answered: false});
        firebaseObj.child("Switch/varItem").set(items[randomItem]);
        firebaseObj.child("Switch/students/"+studentNames[defaultStudent]).set({role:"default", item: "default", answered: false});
    }

    // decimal to binary conversion
    function startDecimalToBinary(){
        //for decimal to binary, generate a random number and have each studentlogin as a bit (ex. 128, 64, 32, 16, 8, 4, 2, 1)
        var max = 255, min = 0;
        var origVal = Math.floor(Math.random() *(max - min + 1)) + min;   //randomly generate number
        var decNum = origVal;

        // push value into firebase and set each studentlogin, bit value, studentlogin state to false and correct state based on binary value
        var bitValues = [128, 64, 32, 16, 8, 4, 2, 1];

        var bits = new Array();

        while(decNum > 0){
            var modNum = decNum%2;
            bits.push(modNum);
            decNum = Math.floor(decNum/2);
        }

        var output = "";
        var down = 8;
        if(bits.length != down){
            while(down >= bits.length){
                bits.push(0);
                down--;
            }
        }
        bits.reverse();

        firebaseObj.child("Binary/number").set(origVal);
        firebaseObj.child("Binary/correct").set(false);
        firebaseObj.child("Binary/currentAddedValue").set(0);
        firebaseObj.child("Binary/currentPosition").set(0);
        for(var stu in studentNames){
            var student = studentNames[stu];
            var order = parseInt(stu);
            firebaseObj.child("Binary/students/"+student).set({
                bit: bitValues[stu],    // set current bit
                studentBit: 0,          // get student bit
                correctBit: bits[stu],  // set correct bit
                position: order         // set position

            });
        }
    }

    //Run Quicksort algorithm below
    var quicksortIter = 0;

    function startQuicksort(){
        //randomly generate each number and start position index from 0
        var items = [2, 10, 4, 9, 17, 8, 12, 3];    // randomly generate array values
        var pivot = Math.floor((items.length-1)/2);

        //push the username, number, and position into the Quicksort database
        firebaseObj.child("Quicksort/currentPivotPointer").set(pivot);
        firebaseObj.child("Quicksort/currentPivotValue").set(items[pivot]);
        firebaseObj.child("Quicksort/currentLeftPointer").set(0);
        firebaseObj.child("Quicksort/currentRightPointer").set(items.length-1);
        firebaseObj.child("Quicksort/onLeftPointer").set(true);
        firebaseObj.child("Quicksort/onRightPointer").set(false);
        firebaseObj.child("Quicksort/sorted").set(false);

        for(var stu in studentNames){
            var student = studentNames[stu];
            var order = parseInt(stu);
            firebaseObj.child("Quicksort/students/"+student).set({number: items[stu], position: order });
        }

        quicksort(items);
        firebaseObj.child("Quicksort/currentStep").set(0);
        firebaseObj.child("Quicksort/totalSteps").set(quicksortIter);
    }

    function swap(items, firstIndex, secondIndex) {
        var temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
    }

    function partition(items, left, right) {
        var pivotPoint = Math.floor((left+right)/2),
            pivotNum = items[pivotPoint],
            i = left,
            j = right;

        // add values into database
        // ex { sortsteps: step0:{ values: [], pivotPointer:, leftPointer:, rightPointer: },...,stepX:{}}
        console.log("Iteration "+quicksortIter);
        console.log("Pivot Pointer at: "+pivotPoint);
        console.log("Pivot Value: "+pivotNum);
        console.log("Left Pointer at: "+i);
        console.log("Right Pointer at: "+j);
        console.log("Array Values: "+items);
        if(quicksortIter === 0){
            firebaseObj.child("Quicksort/sortsteps/step"+quicksortIter).set(
                {values: items, pivotPointer: pivotPoint, pivotValue: pivotNum, leftPointer: i, rightPointer: j, showLine: true});
        } else {
            firebaseObj.child("Quicksort/sortsteps/step"+quicksortIter).set(
                {values: items, pivotPointer: pivotPoint, pivotValue: pivotNum, leftPointer: i, rightPointer: j, showLine: false});
        }

        while (i <= j){
            while (items[i] < pivotNum) {
                i++;
            }
            while (items[j] > pivotNum) {
                j--;
            }
            if(i <= j) {
                swap(items, i, j);
                i++;
                j--;
            }
        }
        return i;
    }

    function quicksort(items, left, right) {
        var index;
        if (items.length > 1) {

            left = typeof left != "number" ? 0 : left;
            right = typeof right != "number" ? items.length - 1 : right;

            index = partition(items, left, right);
            quicksortIter++;

            console.log("Current Index: "+index);
            console.log("\n");
            if (left < index - 1) {
                quicksort(items, left, index - 1);
            }

            if (index < right) {
                quicksort(items, index, right);
            }

        }
        return items;
    }

}]);