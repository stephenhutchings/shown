const DEFAULT_PRECISION = Math.ceil(Math.abs(Math.log10(Number.EPSILON)))

const sum = (a) => a.reduce((m, v) => m + (v.value || v), 0)

const percent = (v) => +(v * 100).toFixed(2) + "%"

const toPrecision = (v, precision = DEFAULT_PRECISION) => {
  const f = Math.pow(10, precision)
  const n = precision < 0 ? v : 0.01 / f + v
  return Math.round(n * f) / f
}

const decimalPlaces = (n) => {
  const s = (+n).toString()
  const ie = s.indexOf("e")
  const id = s.indexOf(".")

  // Get exponent in exponential notation eg "1e-6"
  const e = ie > -1 ? s.slice(ie + 2) * (s[ie + 1] === "-" ? 1 : -1) : 0

  // Subtract index of period from length of string, excluding exponent
  const d = id > -1 ? (ie > -1 ? ie : s.length) - id - 1 : 0

  return Math.max(0, e + d)
}

export default {
  sum,
  percent,
  toPrecision,
  decimalPlaces,
}
