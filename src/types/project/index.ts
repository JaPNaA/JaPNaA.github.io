export default interface IIndex {
    start: number;
    end: number;
    pattern: string;
    /**
     * Meta information about other [year].json files
     * 
     * Maps `[year: int]` to `[minNumber: int, maxNumber: int]`,
     * where `minNumber` is the smallest 'no' value, and
     * `maxNumber` is the largest
     */
    meta: { [x: string]: [number, number] };
}