export const isFinite = (v) => Number.isFinite(v)

export const isInteger = (v) => Number.isInteger(v)

export const min = (...values) => Math.min(...values.filter(isFinite))

export const max = (...values) => Math.max(...values.filter(isFinite))

export const clamp = (val, _min, _max) => min(max(val, _max), _min)

export const tau = Math.PI * 2

export const cos = Math.cos

export const sin = Math.sin

export const abs = Math.abs

export const pow = Math.pow

export const floor = Math.floor

export const ceil = Math.ceil

export const round = Math.round

export const sign = Math.sign

export const log10 = Math.log10
