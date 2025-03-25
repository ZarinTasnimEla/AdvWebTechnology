"use strict";
let numberArr = [2, 3, 4];
console.log(numberArr);
let person = { name: "Ella", age: 22 };
console.log(person.name);
function add(a, b) {
    return (a + b);
}
console.log(4, 78);
//----------------------------
//Built in type
//any
let value = "Hello";
//enum (Role based authentication/module wise access based system) (can check status)
var Role;
(function (Role) {
    Role[Role["Admin"] = 10] = "Admin";
    Role[Role["User"] = 20] = "User";
    Role[Role["Guest"] = 30] = "Guest";
})(Role || (Role = {}));
let user = Role.Guest; //or no object: console.log(Role.Guest)
console.log(user);
//string enum direction
//tuple
let student = ["Reeb", 23];
let userID1 = 123;
let userID2 = 123;
let userID3 = 123;
let userID4 = 123;
let userID5 = "21-44898-2";
//Type Unions
let valuee;
valuee = 2;
valuee = "23Nov";
//literal Types(Setting a value for a variable)
let stat; //cant assign anything else than these2
stat = "Error";
let Per = { name2: "Ellie", age2: 23 };
//generics
function print(val, second) {
    return [val, second];
}
let num = print(3, "78");
//let num2 = print<string>("three") //called same func sent diff type prmtr but T type!
//classsss
class shapes {
    constructor(valu) {
        this.sh = valu; //accessing the private value
    }
    getData() {
        return this.sh;
    }
}
//to send val, must create object
let nData = new shapes(59);
console.log(nData); //returns json type value: shapes { sh: 59 }
console.log(nData.getData()); //59
let nData2 = new shapes("ellooo");
console.log(nData2.getData());
