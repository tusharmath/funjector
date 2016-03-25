import test from 'ava'
import { partial, call, callWith, SKIP as skip } from './index'

test('partial:args', t => {
  const a = partial((x, y) => x * y, 10)
  t.same(a(3), 30)
  t.same(a(4), 40)
})

test('partial:placeholders', t => {
  const a = partial((a, b, c, d) => [a, b, c, d], 1, skip, skip, 4)
  t.same(a(2, 3), [1, 2, 3, 4])
})

test('partial:placeholders:rest', t => {
  const b = partial((a, b, c, d, e) => [a, b, c, d, e], 1, skip, skip, 4)
  t.same(b(2, 3, 5), [1, 2, 3, 4, 5])
})

test('partial:this', t => {
  const a = partial(function (b, c) {
    return this * b + c
  }, 10)
  t.same(a.call(3, 1), 31)
})

test('call', t => {
  const a = partial((x, y) => x * y, 10)
  t.same(call(a, 9, 3), 27)
  t.same(call(a, 9, 4), 36)
})

test('call:unpartialed', t => {
  const a = (x, y) => x * y
  t.same(call(a, 10, 3), 30)
  t.same(call(a, 10, 4), 40)
})

test('callWith', t => {
  const a = partial(function (b, c) {
    return this * b + c
  }, 10)
  t.same(callWith(a, 2, 10, 3), 23)
  t.same(callWith(a, 3, 10, 4), 34)
})
