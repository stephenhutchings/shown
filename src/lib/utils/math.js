export const isFinite = (v) => Number.isFinite(v)

export const isInteger = (v) => Number.isInteger(v)

export const min = (...values) => Math.min(...values)

export const max = (...values) => Math.max(...values)

export const clamp = (v, vmin, vmax) => min(max(v, vmax), vmin)

export const tau = Math.PI * 2

export const cos = Math.cos

export const sin = Math.sin

export const atan2 = Math.atan2

export const abs = Math.abs

export const pow = Math.pow

export const floor = Math.floor

export const ceil = Math.ceil

export const round = Math.round

export const log10 = Math.log10
