/**
 * Creates an array with a fill
 * @param length Length of array
 * @param fill What to fill the array with
 */
export default function createArray<T>(length: number, fill?: T): T[] {
    const arr: T[] = [];
    if (fill) {
        for (let i = 0; i < length; i++) {
            arr[i] = fill;
        }
    } else {
        arr.length = length;
    }
    return arr;
}