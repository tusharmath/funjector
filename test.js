import test from 'ava'
import { partialize, call } from './index'

test('no partialize', t => {
  const mul = (base, a, b) => a * b + base
  t.is(call(mul, 10, 2, 3), 16)
})

test('non functional dependency', t => {
  const mul = partialize((a) => a * 10, 2)
  t.is(call(mul), 20)
})

test('partialize', t => {
  const a = partialize(() => 100, 1000)
  t.same(a[Symbol.for('funjector')], [1000])
})

test('di:funcs', t => {
  const a = x => x * 10
  const b = partialize((x, y, z) => x(y + z), a)
  t.is(call(b, 1, 2), 30)
})

test('di', t => {
  const a = x => x * 10
  const b = partialize((x, y, z) => x(y + z), a)
  const d = partialize((x, y) => x(y, 1000), b)
  t.is(call(d, 1), 10010)
})
