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

    var firebaseObj = new Firebase("https://mobileklalpha.firebaseIO.com/");
    var quicksortIter = 0;

    //get the four digit code and display it to webpage
    firebaseObj.child("Code").on("value", function(snapshot){
        $scope.codekey = snapshot.val();
    }, function(errorObject){
       console.log("The read failed: " + errorObject.code);
    });

    //get the list of students and display it onto the webpage
    var sync = $firebaseArray(firebaseObj.child("Students").orderByChild('name'));
    $scope.studentlist = sync;

    $scope.startActivity = function(name){

        var studentNames = new Array();

        firebaseObj.child("Students").once("value", function(snapshot){
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                studentNames.push(childData.name);
            });
        });

        //for quicksort, randomly generate each number for each studentlogin
        if(name === "quicksort"){
            //save activity name into firebase
            firebaseObj.child('Activity').set({title:"Quicksort", name:"quicksort", dbname:"Quicksort"});

            //randomly generate each number and start position index from 0
            var items = [2, 10, 4, 9, 17, 8, 12, 3];    // randomly generate array values
            var pivot = Math.floor((items.length-1)/2);

            //push the username, number, and position into the Quicksort database
            firebaseObj.child("Quicksort/currentPivotPointer").set(pivot);
            firebaseObj.child("Quicksort/currentPivotValue").set(items[pivot]);
            firebaseObj.child("Quicksort/currentLeftPointer").set(0);
            firebaseObj.child("Quicksort/currentRightPointer").set(items.length-1);

            for(var stu in studentNames){
                var student = studentNames[stu];
                var order = parseInt(stu);
                firebaseObj.child("Quicksort/students/"+student).set({number: items[stu], position: order });
            }

            // run quicksort algorithm and set all sorted orders into database along with the pivots, left and right pointers
            // store each sorted array into a var called sortsteps with the following parameters
            quicksort(items);


        } else if(name === "switch"){
            //for switch statement, assign first studentlogin as item, the other 6 as cases, and last one as default case
            //save activity name into firebase
            console.log("Switch");
            firebaseObj.child('Activity').set({title:"Switch Statements", name:"switch", dbname:"Switch"});
            //pick random studentlogin to be item and default, assign other students as case statements
            //ex studentlogin 4 is item and studentlogin 5 as default
            var items = ["apple","orange","banana","grape","pear","peach","random fruit"];
            /*
             * {students: "name_of_student":{role: "var", item:"apple"}, {name:"", role:"case", item:"orange"}}
             */
            for(var stu=0; stu < 6; stu++){
                var student = studentNames[stu];
                firebaseObj.child("Switch/students/"+student).set({role:"case", item:items[stu]});
            }
            firebaseObj.child("Switch/students/"+studentNames[6]).set({role:"var", item:items[4]});
            firebaseObj.child("Switch/students/"+studentNames[7]).set({role:"default", item: "default"});

        } else if(name === "binary"){
            //save activity name into firebase
            firebaseObj.child('Activity').set({title:"Decimal To Binary", name:"binary", dbname:"Binary"});

            //for decimal to binary, generate a random number and have each studentlogin as a bit (ex. 128, 64, 32, 16, 8, 4, 2, 1)
            var origVal = 55;   //randomly generate number
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
            for(var stu in studentNames){
                var student = studentNames[stu];
                var order = parseInt(stu);
                firebaseObj.child("Binary/students/"+student).set({bit:bitValues[stu], correctBit:bits[stu], position: order});
            }
        }

        //go to the dashboard page once all students are set up
        $location.path('/dashboard');
    }

    //when logout button is clicked, clear database and destroy user session

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
        firebaseObj.child("Quicksort/sortsteps/step"+quicksortIter).set(
            {values: items, pivotPointer: pivotPoint, pivotValue: pivotNum, leftPointer: i, rightPointer: j});

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