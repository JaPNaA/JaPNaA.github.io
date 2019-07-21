/**
 * @param r_ red, 0..255
 * @param g_ green, 0..255
 * @param b_ blue, 0..255
 * @returns hue, 0..360
 */
export default function getHueFromRGB(r_: number, g_: number, b_: number): number | undefined {
    const r = r_ / 255;
    const g = g_ / 255;
    const b = b_ / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    if (max === min) {
        return undefined;
    } else {
        const d = max - min;
        switch (max) {
            case r:
                return ((g - b) / d + (g < b ? 6 : 0)) * 60;
            case g:
                return ((b - r) / d + 2) * 60;
            case b:
                return ((r - g) / d + 4) * 60;
        }
    }
}