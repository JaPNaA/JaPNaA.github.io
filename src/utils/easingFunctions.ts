/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 *
 * Adapted from https://gist.github.com/gre/1650294
 */

/** no easing, no acceleration */
export function linear(t: number): number {
    return t
}

/** accelerating from zero velocity */
export function easeInQuad(t: number): number {
    return t * t
}

/** decelerating to zero velocity */
export function easeOutQuad(t: number): number {
    return t * (2 - t)
}

/** acceleration until halfway, then deceleration */
export function easeInOutQuad(t: number): number {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/** accelerating from zero velocity */
export function easeInCubic(t: number): number {
    return t * t * t
}

/** decelerating to zero velocity */
export function easeOutCubic(t: number): number {
    return (-t) * t * t + 1
}

/** acceleration until halfway, then deceleration */
export function easeInOutCubic(t: number): number {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}

/** accelerating from zero velocity */
export function easeInQuart(t: number): number {
    return t * t * t * t
}

/** decelerating to zero velocity */
export function easeOutQuart(t: number): number {
    return 1 - (--t) * t * t * t
}

/** acceleration until halfway, then deceleration */
export function easeInOutQuart(t: number): number {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
}

/** accelerating from zero velocity */
export function easeInQuint(t: number): number {
    return t * t * t * t * t
}

/** decelerating to zero velocity */
export function easeOutQuint(t: number): number {
    return 1 + (--t) * t * t * t * t
}

/** acceleration until halfway, then deceleration */
export function easeInOutQuint(t: number): number {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
}

// next functions are adapted from https://github.com/d3/d3-ease/blob/master/src/exp.js

const EXP_CORRECTION = Math.pow(2, -10);

/** accelerating from zero veolcity */
export function easeInExp(t: number): number {
    return Math.pow(2, 10 * t - 10) - EXP_CORRECTION;
}

/** decelerating to zero velocity */
export function easeOutExp(t: number): number {
    return 1 - Math.pow(2, -10 * t) + EXP_CORRECTION;
}

/** acceleration until halfway, then deceleration */
export function easeInOutExp(t: number): number {
    return ((t *= 2) <= 1 ? Math.pow(2, 10 * t - 10) - EXP_CORRECTION : 2 - Math.pow(2, 10 - 10 * t) + EXP_CORRECTION) / 2;
}