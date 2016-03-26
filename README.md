# Funjector

[![Build Status][travis-svg]][travis]
[![npm][npm-svg]][npm]

[travis-svg]: https://travis-ci.org/tusharmath/funjector.svg?branch=master
[travis]:     https://travis-ci.org/tusharmath/funjector
[npm-svg]:    https://img.shields.io/npm/v/funjector.svg
[npm]:        https://www.npmjs.com/package/funjector

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
- **Without mocking B**: In this case you don't mock the function `B()` and let A use the global B function, thus you end up testing the B function as well. This is fine if the function is simple and is only being used by A. If the function is complex and say performs some time consuming operations, then its always better to mock B.
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

Though this may seem like a good solution, it comes with a major drawback — *Wherever I am going to use A, I will have to pass an additional param B to it.*

This can nasty pretty easily —

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

As you can see, though `A` only needs three params viz — `B`, `x`, `y` I end up passing `C` because internally `B` needs `C`. This will be more complicated if `C` depends on other params and we need to pass them as well to call `A`. We will end up in an **arguments soup** where we would be passing a lot of arguments to a function that are not going to be used directly by itself.

### With funjector
We will declaratively bind `A` with `B` as the first argument and similarly `B` with `C` as the first argument. So we won't need to pass `C` where ever we are using `B`. Technically we are implementing *dependency injection* for functions.

```javascript
import {partial} from 'funjector'

function C (x) {
  return x - 1
}

const B = partial(function (C, x) {
  return C(x * 100)
}, C) // Binds the function B with C as the first param

const A = partial(function (B, x, y) {
  return B(x + y)
}, B) // Binds the function A with B as the first param

A(10, 20) // Calls the partialized version of the function
```
So we can create partial functions in a declarative manner but most importantly we can now control when to use that partial function vs its original version. This granular control helps in writing better tests and injecting dependencies on the fly. For example to call `A` with a custom implementation of `B` we could do this -

```javascript

import {orig} from 'funjector'

// Calls the original version of function A with a custom implementation of B
orig(A)(i => i + 1, 10, 20)
```

Here when I use `orig(A)` I get the original *unpartialized* version of the function, which I can call with a custom implementation of `B` which is `i => i + 1`.

### API

#### funjector.partial(func, \*args)
Creates a function that calls *func* with *args* arguments prepended to those provided to the new function.

```javascript
import {partial} from 'funjector'
const a = partial((x, y) => x * y, 10)
a(3) // OUTPUTS: 30
a(4) // OUTPUTS: 40
```

#### funjector.orig(func)
Returns the original version of the partialized function.

```javascript
import {orig, partial} from 'funjector'
const mul = (x, y) => x * y
const mul10 = partial(mul, 10)
orig(mul10) === mul // OUTPUTS: true
```

#### funjector.SKIP
a placeholder that can be used with the function *partial()* to selectively control the order of arguments that are being passed to the function.

```javascript
import {SKIP, partial} from 'funjector'
const a = partial((a, b, c, d) => [a, b, c, d], 1, SKIP, SKIP, 4)
a(2, 3) // OUTPUTS:  [1, 2, 3, 4]
```
[lodash-partial]: https://lodash.com/docs#partial
## How is it different than [lodash.partial][lodash-partial]?

As a matter of fact it isn't! The only added functionality is that you have more control over when to use the *partialized* version.
