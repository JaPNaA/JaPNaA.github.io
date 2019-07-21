export default function lightenRGB(r: number, g: number, b: number, amount: number): [number, number, number] {
    const iamount = 1 - amount;
    const amount255 = amount * 255;

    return [
        r * iamount + amount255,
        g * iamount + amount255,
        b * iamount + amount255
    ];
}