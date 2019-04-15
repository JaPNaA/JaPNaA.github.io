export default function absSum(arr: number[]): number {
    let sum = 0;
    for (const i of arr) {
        sum += Math.abs(i);
    }
    return sum;
}