import test from 'ava'
import { partial, call, callWith } from './index'

test('partialize:args', t => {
  const a = partial((x, y) => x * y, 10)
  t.same(a(3), 30)
  t.same(a(4), 40)
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

test('callWith', t => {
  const a = partial(function (b, c) {
    return this * b + c
  }, 10)
  t.same(callWith(a, 2, 10, 3), 23)
  t.same(callWith(a, 3, 10, 4), 34)
})
