export default function darkenRGB(r: number, g: number, b: number, amount: number): [number, number, number] {
    const iamount = 1 - amount;
    return [r * iamount, g * iamount, b * iamount];
}