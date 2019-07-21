export default function rgbToString(r: number, g: number, b: number, a?: number): string {
    if (a) {
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    } else {
        return "rgb(" + r + "," + g + "," + b + ")";
    }
}