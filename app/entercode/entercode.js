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
.controller('EnterCodeCtrl', ['$scope', '$firebaseAuth', '$firebase', '$location', function($scope, $firebaseAuth,
                                                                                            $firebase, $location){
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
        $scope.studentlist.$loaded().then(function(students){
            $scope.noOfStudents = students.length;
        });

        //create the start activity function (develop quicksort as the example app)
        $scope.startActivity = function(name){

            var studentNames = new Array();

            firebaseObj.child("Students").once("value", function(snapshot){
                snapshot.forEach(function(childSnapshot) {
                    var childData = childSnapshot.val();
                    //push all names into the array
                    studentNames.push(childData.name);
                });
            });

            //for quicksort, randomly generate each number for each student
            if(name === "quicksort"){
                //save activity name into firebase
                firebaseObj.child('Activity').set("Quicksort");

                //randomly generate each number and start position index from 0
                var items = [2, 10, 4, 9, 17, 8, 12, 3];
                var pivot = Math.floor((items.length)/2);

                //push the username, number, and position into the Quicksort database
                firebaseObj.child("Quicksort/pivotValue").set(pivot);
                firebaseObj.child("Quicksort/leftPointer").set(0);
                firebaseObj.child("Quicksort/rightPointer").set(items.length-1);
                for(var stu in studentNames){
                    var student = studentNames[stu];
                    firebaseObj.child("Quicksort/students/"+student).set({number: items[stu], position:stu});
                }

            } else if(name === "switch"){
                //for switch statement, assign first student as item, the other 6 as cases, and last one as default case
                //save activity name into firebase
                console.log("Switch");
                firebaseObj.child('Activity').set("Switch Statements");
                //pick random student to be item and default, assign other students as case statements
                //ex student 4 is item and student 5 as default
                var items = ["apple","orange","banana","grape","pear","peach","random fruit"];
                /*
                 * {students: "name_of_student":{role: "var", item:"apple"}, {name:"", role:"case", item:"orange"}}
                 */
                for(var stu=0; stu < 6; stu++){
                    var student = studentNames[stu];
                    firebaseObj.child("Switch/students/"+student).set({role:"case", item:items[stu]});
                }
                firebaseObj.child("Switch/students/"+studentNames[6]).set({role:"var", item:items[4]});
                firebaseObj.child("Switch/students/"+studentNames[7]).set({role:"default"});

            } else if(name === "binary"){
                //save activity name into firebase
                firebaseObj.child('Activity').set("Decimal To Binary");
                //for decimal to binary, generate a random number and have each student as a bit (ex. 128, 64, 32, 16, 8, 4, 2, 1)
                var origVal = 55;
                var decNum = origVal;
                // push value into firebase and set each student, bit value, student state to false and correct state based on binary value
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
                    firebaseObj.child("Binary/students/"+student).set({bit:bitValues[stu], correctBit:bits[stu]});
                }
            }

            //go to the dashboard page once all students are set up
            $location.path('/dashboard');
        }

    }]
);