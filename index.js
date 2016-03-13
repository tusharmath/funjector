const e = exports
const toArray = (x, i) => Array.prototype.slice.call(x, i)
const FUNJECTOR_KEY = Symbol.for('funjector')
const get = (func) => {
  if (typeof func !== 'function' || !func[FUNJECTOR_KEY]) {
    return func
  }

  const injections = func[FUNJECTOR_KEY].map(get)
  return function () {
    const args = toArray(arguments)
    return func.apply(this, injections.concat(args))
  }
}

e.partialize = function (func) {
  func[FUNJECTOR_KEY] = toArray(arguments, 1)
  return func
}

e.call = function (func) {
  const args = toArray(arguments, 1)
  return get(func).apply(this, args)
}
