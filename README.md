# ReSpect

[![Build Status](https://travis-ci.org/PeteProgrammer/respect.svg?branch=master)](https://travis-ci.org/PeteProgrammer/respect)

This is an RSpec inspired test framework for ReasonML/OCaml/Bucklescript. The
runner uses raw javascript code, so it will only run in node environments at the moment.

I base this on a lot of experience I gained from a similar project for F#, FSpec.

This project is still in a very early stage, so use at your own risk.

## Latest changes

### 0.4.2

 * Added Respect.Ctx module as alias for TestContext

### 0.4.1

 * TestContext.don function to help accept a done callback from setup functions

### 0.4.0

 * Refactor: Test context is now represented by an object instead of a mutable
     record. But the TestContext module still has functions for operating on the
     actual context, so existing code should be compatible.
 * Testcontext subject: The subject is a function that evaluates to an actual
     value when requested. The function receives the test context as input. You
     can assign the subject in a parent group, and modify the context in a child
     group.
 * TextContext.map: Allows you to easily modify objects in the context.

### 0.3.0

 * Breaking change: In order to get better error messages when match fails, the
     MatchFailure constructor now takes two args, the actual object, and the
     expected object of the failed matcher.

Previously when testing async code, I could get messages like this
```
Expected: [ ["john.doe@example.com"], ...]
Actual: [ [Function] ]
```
Which wasn't helpful in finding the bug.

## TODO

 * "Finalize" DSL for building test suites.
 * Determine whether or not to allow mutation of `TestContext`. This worked well
     in F#/FSpec, but we don't have runtime type checking in Reason/Bucklescript.
 * Finalize assertion framework.
 * Nicer test output when running.
 * Nicer test output when assertions fail.
 * Internally, figure out how to report progresss.
 * More flexible runner, e.g. configurable location of test files
 * ✓ Handle async timeout to avoid hanging when async tests don't call back
 * Make timeout configurable through example metadata.

Although, I had learned from many mistakes when building FSpec, there are some
problems that demand different solutions in Reason/Bucklescript. Async support
in particular.

## Installation

This guide will help you get `Respect` and having a test-watcher setup.
_Respect_ in itself does not implement test-watcher functionality, but it is
easily added with the _nodemon_ package.

### Basic installation

First, add _respect_, the npm package is named "re-respect"

```
npm install --save-dev re-respect
```

As this is a package with Reason code, you need to add a reference to the
package in the _bsconfig.json_ file, as well.

You also need to add a _tests_ folder to contain the tests. At this early time
of writing, the only place that Respect searches for tests files is in the
_tests_ folder, so be sure that is the exact name of the folder.

```
"files": [
  {"dir": "src"},
  {"dir": "tests",
   "type": "dev" }
],
"bs-dev-dependencies": [
  "re-respect"
]
```

Create a skeleton test, "./tests/tests.re":

```
open Respect.Dsl;

describe "My first test" [
  it "runs" (fun _ => {()})
] |> register
```

The `register` call is necessary at this early stage, it adds the specs to one
global test group.

Now, let's add a test target to _package.json_

```
"scripts": {
   ...
   "test": "respect"
}
```

And now, you can run the tests with `npm run test`

### Adding test watcher functionality

The npm package _nodemon_ can trigger running _.js_ files when the file system
changes. We can use this to implement filesystem watcher functionality. First
install the package

```
npm install --save-dev nodemon
```

And then add a script to the _package.json_ file

```
  "scripts": {
    ...
    "test:watch": "nodemon node_modules/re-respect/bin/respect"
  }
```

And now, you can have the tests run automatically when a _.js_ file changes
with the command `npm run test:watch`. Of course, when you edit reason source
files, that will not trigger a test run, so you need to run `npm run watch` in a
different terminal.

### Optionally, create a _dev_ task

In the previous section, you had to run two watchers in two separate terminals
in order to have full watcher implementation. We can create an npm script that
does both of these tasks with the help of the npm package _npm-run-all_, which
allows parallel execution of multiple scripts.

```
npm install --save-dev npm-run-all
```

In the _package.json_ file, add a new script:

```
  "scripts": {
    ...
    "dev": "run-p watch test:watch"
  }
```

The command `run-p` is part of _npm-run-all_, and it runs the two scripts in
parallel.

Now you can run `npm run dev` in one terminal, and it will compile reason files,
and run tests, as files are written on disk.

## Syntax

Instead of using mutating nested function calls, _Respect_ uses immutable data
structures for building up the test context and tests. Therefore, the
`desribe`-operation takes nested operations in a list.

```
register(
  describe "Parent context" [
    it "has some test" (fun _ =>
      ...
    )
    it "has some test" (fun _ =>
      ...
    )

    describe "Child context" [
      it "has more tests" (fun _ =>
        ...
      )
    ]
  ])
```

The only mutating construct here is the function `register` which adds the group
of examples to an implicit root group.

### Pending tests

Often it is useful to write pending tests, small skeleton desrciptions of
functionality you need to implement. This can turn the test framework into a
small todo list:

```
describe("Register user", [
  pending("Returns Ok(user) if registration succeeded"),
  pending("Returns Error(DuplicateEmail) if email already registered"),
]) |> register
```

Pending tests will not result in failure when running the tests.

## Async tests

Async support is currently best implemented by opening `Respect.Dsl.Async`.

I believe that this will be in time be the the only "official" Dsl to end with,
but maybe with helper functions to write sync examples if you need to.

```
open Respect.Dsl.Async;

describe "Parent context" [
  it "has an async test" (fun _ don => {
    if (success) {
      don ();
    }else {
      don err::"Error" ();
    }
  })
] |> register;
```

There is currently async matcher support through the function `shoulda`
(should-async). The function has the signature:

```
(matcher : matcher 'a 'b) => (actual : 'a) => (cb : doneCallback) => unit
```

This signature plays nicely with the callback allowing you to write tests like
this:

```
describe "Register User" [
  describe "Posting valid user" [
    it "creates a user" (fun _ => {
      createValidInput ()
        |> UserFeature.registerUser
        |> shoulda asyncSucceed
    })
  ]
] |> register
```

This is a bit cryptic but I'll try to explain

* Our test function didn't explicitly specify a done callback
* We didn't pass a done callback to to the `shoulda` function either. This makes
    the result of the `shoulda` function another function, which takes a done
    callback.
* So the result of our test function is the function returned by `should`, the
    one that takes done callback. Thus our test function has the exact shape that `it` expects.
* The `registerUser` is an async function that expects a callback that we didn't supply.
* The asyncSucceed takes an async function as argument and supplies the right
    callback that binds it to the done callback.

This doesn't play nice however, if you want to have multiple assertions in the
same test :(

It will come.

Please be aware that the matcher syntax is likely to change, but I will try
to keep backward compatibility by moving alternate matcher framework into separate
modules.

## Matchers (breaking change in version 0.2)

The matchers framework is based on these types:

```
type matchResult('t) =
  | MatchSuccess('t)
  | MatchFailure(Obj.t);

type matcher('a, 'b) = 'a => (matchResult('b) => unit) => unit;

exception MatchFailedException(string);
```

So a matcher takes an actual value and provides a matchresult asyncrounously
through a callback. Matchers that evaluate synchronously can use these helper
functions

```
let matchSuccess = (a) => cb => cb(MatchSuccess(a));
let matchFailure = (a) => cb => cb(MatchFailure(a |> Obj.repr));
```

So if we look at the `equal` match constructor:

```
let equal = (expected, actual) =>
  actual == expected ? matchSuccess(actual) : matchFailure(expected);
```

So it takes an expected value and returns a matcher based on this.

## Test Metadata

You can add metadata to a group or an example. And if you have metadata on a
parent group, you can override it in a child group. The metadata is added using
the strange looking _**>_ operator (I chose this because the _*_ makes it right
associative, which I need in order to avoid parenthesis hell, and the _>_ helps
indicating that the metadata binds to the group/example to come.

The interesting thing is that the metadata is initialized before the example
starts executing, which means that metadata specified on an example can effect
the setup code executed in a parent group. The following example shows how:

```
open Respect.Dsl.Async;

describe "Register user" [
  beforeEach (fun ctx don => {
    ctx |> TestContext.get "userName"
    |> /* do something interesting with the user */
    don()
  }),

  ("userName", "johndoe") **>
  describe "A valid user name was entered" [
    it "Correctly registers the user" (fun ctx don => {
       ...
       don
    })
  ],

  ("userName", "!@#$") **>
  describe "An invalid user name was entered" [
    it "Returns a sensible error message" (fun ctx don => {
       ...
       don ()
    })
  ]
] |> register
```

### Composing Matchers

Matchers can be composed using the "fish" operator `>=>`, so a `matcher 'a 'b`
can be composed with a `matcher 'b 'c` into a `matcher 'a 'c`.

This can be particularly useful when the value passed with the success is
different from the actual value passed to the matcher. Here is an example from a
piece of production code I am working on:

```
/* General types to handle errors and async code */
type result 'a 'b =
  | Ok 'a
  | Error 'b;
type async 'a = ('a => unit) => unit;
type asyncResult 'a 'b = async (result 'a 'b);

/* Specific error types returned by repository layer */
type databaseError 'id =
| DocumentNotFound string 'id
| MongoErr MongoError.t;

/* This is a matcher that verifies that an async function fails. "actual" is a
function that takes a result callback */
let asyncFail actual => {
  AsyncMatchResult (fun cb => {
    actual
      |> AsyncResult.run (fun
      | Error y => cb (MatchSuccess y)
      | Ok y => cb (MatchFailure (Obj.repr y)));
      });
};
```

The interesting thing is that the `asyncFail` matcher passes the error to the
`MatchResult` constructor, to be used by a new matcher. In this tests we compose
it with a new matcher that verifies that we actually get the expected error.

```
describe "UserRepository" [
    describe "findById" [
      describe "record doesn't exist" [
        it "returns DocumentNotFound" (fun _ => {
          let id = "dummy";
          UserRepository.getById id
            |> shoulda (UserFeature_test.asyncFail >=> (equal (DocumentNotFound "users" id)))
        })
      ]
    ]
  ],
] |> register;
```

The operator supports combining sync and async matchers as you like - but they
are not properly tested in the framework. Only the above case async>=>sync
matcher has been tested in the wild.
