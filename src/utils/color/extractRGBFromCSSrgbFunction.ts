const matcher = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*(\d+)\s*)?\)/;

export default function extractRGBFromCSSrgbFunction(str: string): [number, number, number, number?] {
    const match = str.match(matcher);
    if (!match) { throw new Error("Invalid color"); }
    if (match[5]) {
        return [
            parseInt(match[1]),
            parseInt(match[2]),
            parseInt(match[3]),
            parseInt(match[5])
        ];
    } else {
        return [
            parseInt(match[1]),
            parseInt(match[2]),
            parseInt(match[3])
        ];
    }
}