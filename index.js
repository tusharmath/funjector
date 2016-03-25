const e = exports
const toArray = (x, i) => Array.prototype.slice.call(x, i)
const FUNJECTOR_KEY = Symbol.for('funjector')
const PLACEHOLDER_KEY = Symbol.for('funjectorPlaceholder')

e.skip = PLACEHOLDER_KEY

e.partial = function (func) {
  const args = toArray(arguments, 1)
  const partialized = function () {
    const _args = toArray(arguments)
    const params = args
      .map(x => x === PLACEHOLDER_KEY ? _args.shift() : x)
      .concat(_args)
    return (func.apply(this, params))
  }
  partialized[FUNJECTOR_KEY] = func
  return partialized
}

e.call = function (func) {
  const args = toArray(arguments, 1)
  return func[FUNJECTOR_KEY].apply(this, args)
}

e.callWith = function (func, ctx) {
  const args = toArray(arguments, 2)
  return func[FUNJECTOR_KEY].apply(ctx, args)
}
