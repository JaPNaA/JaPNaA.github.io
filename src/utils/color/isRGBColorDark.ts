// https://stackoverflow.com/a/3943023
export default function isRGBColorDark(r: number, g: number, b: number): boolean {
    return 0.299 * r + 0.587 * g + 0.114 * b <= 150;
}