let numberArr:number[]=[2,3,4]
console.log(numberArr);

let person:{name:string;age:number} = {name:"Ella", age:22}
console.log(person.name);

function add(a:number,b:number):number //explicitly func returntype & parameter type declare
{ 
    return (a+b)
}
console.log(4,78);

//----------------------------

//Built in type

//any
let value:any="Hello"

//enum (Role based authentication/module wise access based system) (can check status)
enum Role{Admin=10, User=20, Guest=30}
let user:Role = Role.Guest//or no object: console.log(Role.Guest)
console.log(user);

//string enum direction

//tuple
let student:[string,number]=["Reeb", 23]

//Type Aliases
type id=number | string //want to use this type smwhere

let userID1 : id=123
let userID2 : id=123
let userID3 : id=123
let userID4 : id=123
let userID5 : id="21-44898-2"

//Type Unions

let valuee:string|number
valuee=2
valuee = "23Nov"

//literal Types(Setting a value for a variable)
let stat: "Success" | "Error" //cant assign anything else than these2
stat="Error"

//interface
interface Person{
    name2:string;
    age2:number;
    address?:string; //? makes that property optional
}

let Per:Person={name2:"Ellie", age2:23}

//generics
function print<T,U>(val:T, second:U) : [T,U]
{
    return [val,second]
}
let num = print<number,string>(3,"78")
//let num2 = print<string>("three") //called same func sent diff type prmtr but T type!


//classsss

class shapes<T> {//class type = generic T
    private sh;//field sh

    constructor(valu:T)
    {
        this.sh = valu //accessing the private value
    }

    getData() : T {
        return this.sh
    }
}
//to send val, must create object
let nData = new shapes<number>(59)
console.log(nData);//returns json type value: shapes { sh: 59 }
console.log(nData.getData());//59

let nData2 = new shapes<string>("ellooo")
console.log(nData2.getData());





