import { floor, abs, log10 } from "./math.js"

export const EPSILON = Number.EPSILON

export const DEFAULT_PRECISION = floor(abs(log10(EPSILON)))
