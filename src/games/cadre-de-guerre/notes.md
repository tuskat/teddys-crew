# Entities Hierarchy

Players, Enemies and Neutrals are all following the sames rules.
As such, it is important to make them herit the same classes.

Look at compision/inheritances :
https://medium.com/developers-writing/typed-object-composition-with-typescript-and-es7-decorators-292afc26c7bd

# To Do

- neutrals will inherit from Entity

# About lambdas?

const myObject = { foo: 'bar '}

myObject.newFunc = function () {
  console.log(this);
}

myObject.newFuncLambda = () => {
  console.log(this);
}

myObject.newFunc() // will print out myObject
myObject.newFuncLambda() // will work but will not print myObject, cause scope

# How do you give a function to an object so this function get added to such object?

class LeGame {
  constructor(1, 2, 3, 4 , uneFunction) {
    // all the construction code
    this.uneFunction = uneFunction;

    // Functions are first-class objects in JAVASCRIPT
    // That means it behaves just like an object, or any other type
    // you pass it around, you can save it, whatever you want

    // If you want to call `this` inside uneFunction
    // you need to MAKE SURE, that uneFunction is a function(){} and not a ()=>{}
    //
    // But the best practice here would be to pass this as an argument, that way you support both
    //
    // this.uneFunction(this);

    this.mySkills = [uneFunction];
  }

  update() {
    this.uneFunction();

    this.mySkills.forEach((skill) => {
      skill(this);
    })
  }
}

# Giving arguments as an array/object instead of one by one like a peasant

## Actual

function RABIER(a, b, c) {
  console.log(a,b,c);
}

RABIER(1,2,3);

## Expected

If you put the args in an array

const args = [1,2,3]

RABIER(...args) // That works

// ---- ALTERNATIVE VERSION 2
// If they are in an object

const args2 = { a:1, b:2, c: 3 }

// you can transform it into an array -->

Object.values(args2); // but that doesn't guarantee the order

// so this could work

RABIER(..._.pick(args2, 'a', 'b', 'c')) // but it's not much better


// ----IN THE CASE OF A CLASS
// The above works, but you have this option too

class LeClass {
  constructor(a,b,c) {

  }
}

// you add this new function, which serves as a helper to create the class
LeClass.fromRecord = function (record) {
  const { a, b, c } = record;
  return new LeClass(a, b, c)
}

// and then in your code you do

LeClass.fromRecord(record) // instead of new LeClass(record.a, record.b, record.c)







