// from gitlab:JaPNaA/JaPNaABotDiscord

/**
 * Generates a random number with parameters
 * @param Number min value
 * @param max max value
 * @param step always divisible by
 * @returns generated
 */
function random(min: number = 0, max: number = 1, step: number = 0): number {
    if (step === 1) {  // optimize for 1
        return Math.floor(min + Math.random() * (max - min));
    } else if (step) { // step is not 0
        let smin: number = Math.floor(min / step);
        let smax: number = Math.floor(max / step);
        return step * Math.floor(smin + Math.random() * (smax - smin));
    } else { // step is 0, no step, default
        return min + Math.random() * (max - min);
    }
}

export default random;