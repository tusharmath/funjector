import test from "ava"
import {partial, call, callWith, SKIP as skip, orig} from "./index"

test('partial:args', t => {
  const a = partial((x, y) => x * y, 10)
  t.deepEqual(a(3), 30)
  t.deepEqual(a(4), 40)
})

test('partial:placeholders', t => {
  const a = partial((a, b, c, d) => [ a, b, c, d ], 1, skip, skip, 4)
  t.deepEqual(a(2, 3), [ 1, 2, 3, 4 ])
})

test('partial:placeholders:rest', t => {
  const b = partial((a, b, c, d, e) => [ a, b, c, d, e ], 1, skip, skip, 4)
  t.deepEqual(b(2, 3, 5), [ 1, 2, 3, 4, 5 ])
})

test('partial:this', t => {
  const a = partial(function (b, c) {
    return this * b + c
  }, 10)
  t.deepEqual(a.call(3, 1), 31)
})

test('call', t => {
  const a = partial((x, y) => x * y, 10)
  t.deepEqual(call(a, 9, 3), 27)
  t.deepEqual(call(a, 9, 4), 36)
})

test('call:unpartialed', t => {
  const a = (x, y) => x * y
  t.deepEqual(call(a, 10, 3), 30)
  t.deepEqual(call(a, 10, 4), 40)
})

test('callWith', t => {
  const a = partial(function (b, c) {
    return this * b + c
  }, 10)
  t.deepEqual(callWith(a, 2, 10, 3), 23)
  t.deepEqual(callWith(a, 3, 10, 4), 34)
})

test('orig', t => {
  const func = function (b, c) {
    return this * b + c
  }
  const a = partial(func, 10)
  t.is(orig(a), func)
})

test('decorator', t => {

})
