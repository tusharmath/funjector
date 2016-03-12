# Funjector

The purpose of this module was to create a simple dependency injection module for functions. This makes writing unit tests a breeze.

# Installation

```bash
npm i funjector --save
```

# Example

[pure-functions]: https://en.wikipedia.org/wiki/Pure_function

Say I have a scenario where there is a function `A` that I want to **test**, which internally calls another global function `B`. For the sake of simplicity lets also assume that both the functions a truly [pure][pure-functions].


```javascript
function B (x) {
  return x * 100
}

function A (x, y) {
  return B(x + y)
}
```

There are multiple ways you can test function `A()`
- **Without mocking B**: In this case you don't mock the function `B()` and let A use the global B function. In this approach you end up testing the B function as well. This is fine if the function is simple and is only being used by A. If the function is complex and say performs some time consuming operations, then its always better to mock B.
- **Mocking B Globally**: So assuming that B isn't a simple function and must be mocked we can globally mock B. Global mocking comes with its own set of overheads such reseting the Mocked function after every test. There are quite a few libraries that will help you mock and reset functions/modules globally. Most of them are quite essentially hacks as they bind themselves to env globals such as `require` and `process`.
- **Mocking B Locally**: This is exactly what one should be doing. We need to re-write A such that B is a param to A.
```javascript
function B (x) {
  return x * 100
}

function A (B, x, y) {
  return B(x + y)
}

A(B, 10, 20) // Sample Call for function A
```

Though this seems like a good solution but it comes with a major drawback — *Wherever I am going to use A, I will have to pass an additional param B to it.*

This can get out of control pretty easily —

```javascript
function C (x) {
  return x - 1
}

function B (C, x) {
  return C(x * 100)
}

function A (B, C, x, y) {
  return B(C, x + y)
}

A(B, C, 10 ,20)
```

As you can, though A only needs three params viz — B, x, y I have to pass C because internally B needs C! This is still an overly simplified version of issues one might face.


### With funjector

```javascript
import {inject, get} from 'funjector'

function C (x) {
  return x - 1
}

function B (C, x) {
  return C(x * 100)
}
inject(B, C) // Binds the function B with C as the first param

function A (B, x, y) {
  return B(x + y)
}
inject(A, B) // Binds the function A with B as the first param

get(A)(10, 20)

```
