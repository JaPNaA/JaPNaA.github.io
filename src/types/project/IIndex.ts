export default interface IIndex {
    start: number;
    end: number;
    meta: { [x: string]: {
        /** Smallest `no` */
        [0]: number,
        /** Largest `no` */
        [1]: number,
        /** Path to file */
        [2]: string
    } };
}