import test from 'ava'
import { inject, get } from './index'

test('no inject', t => {
  const mul = (base, a, b) => a * b + base
  t.is(get(mul), mul)
})

test('non functions', t => {
  const mul = {}
  t.is(get(mul), mul)
})

test('inject', t => {
  const a = inject(() => 100, 1000)
  t.same(a[Symbol.for('funjector')], [1000])
})

test('di:funcs', t => {
  const a = x => x * 10
  const b = inject((x, y, z) => x(y + z), a)
  t.is(get(b)(1, 2), 30)
})

test('di', t => {
  const a = x => x * 10
  const b = inject((x, y, z) => x(y + z), a)
  const d = inject((x, y) => x(y, 1000), b)
  t.is(get(d)(1), 10010)
})
